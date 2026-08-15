import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { QueryNoteDto } from './dto/query-note.dto';
import { NoteTier, NotePurchaseStatus } from '@prisma/client';
import { Storage } from 'src/common/lib/Disk/Storage';

@Injectable()
export class NoteService {
  constructor(private readonly prisma: PrismaService) { }

  // ================= ADMIN METHODS =================
  async create(dto: CreateNoteDto) {
    const { package_ids, ...rest } = dto;
    return this.prisma.note.create({
      data: {
        ...rest,
        packages: package_ids && package_ids.length > 0 ? { connect: package_ids.map((id) => ({ id })) } : undefined,
      },
      include: { packages: { select: { id: true, title: true } } },
    });
  }

  async findAllAdmin(query: QueryNoteDto) {
    const { page = 1, limit = 10, search, subject, tier, package_id } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};
    if (subject) where.subject = subject;
    if (tier) where.tier = tier;
    if (package_id) where.packages = { some: { id: package_id } };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.note.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { packages: { select: { id: true, title: true } } },
      }),
      this.prisma.note.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async findOneAdmin(id: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { packages: { select: { id: true, title: true } } },
    });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async update(id: string, dto: UpdateNoteDto) {
    await this.findOneAdmin(id);
    const { package_ids, ...rest } = dto;

    return this.prisma.note.update({
      where: { id },
      data: {
        ...rest,
        packages: package_ids ? { set: package_ids.map((id) => ({ id })) } : undefined,
      },
      include: { packages: { select: { id: true, title: true } } },
    });
  }

  async remove(id: string) {
    await this.findOneAdmin(id);

    const note = await this.prisma.note.delete({ where: { id } });

    await Storage.delete(note.file_path);

    return {
      id: note.id,
    }
  }


  async attachPackages(noteId: string, packageIds: string[]) {
    await this.findOneAdmin(noteId);

    return this.prisma.note.update({
      where: { id: noteId },
      data: {
        packages: {
          connect: packageIds.map((id) => ({ id })),
        },
      },
      include: { packages: { select: { id: true, title: true } } },
    });
  }

  async detachPackages(noteId: string, packageIds: string[]) {
    await this.findOneAdmin(noteId);

    return this.prisma.note.update({
      where: { id: noteId },
      data: {
        packages: {
          disconnect: packageIds.map((id) => ({ id })),
        },
      },
      include: { packages: { select: { id: true, title: true } } },
    });
  }

  // ================= USER METHODS =================
  // ================= USER METHODS =================
  async findAllForUser(userId: string, query: QueryNoteDto) {
    const { page = 1, limit = 10, search, subject, tier, package_id } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = { is_published: true };
    if (subject) where.subject = subject;
    if (tier) where.tier = tier;
    if (package_id) where.packages = { some: { id: package_id } };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [notes, total] = await Promise.all([
      this.prisma.note.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          packages: { select: { id: true, title: true } },
          note_purchases: {
            where: { user_id: userId, status: NotePurchaseStatus.paid },
            select: { id: true },
          },
        },
      }),
      this.prisma.note.count({ where }),
    ]);

    // 1. Gather all unique package IDs across the retrieved notes
    const packageIds = Array.from(
      new Set(notes.flatMap((note) => note.packages.map((pkg) => pkg.id))),
    );

    // 2. Fetch all active user package accesses for these packages in a single query
    const activeAccesses =
      packageIds.length > 0
        ? await this.prisma.userPackageAccess.findMany({
          where: {
            user_id: userId,
            package_id: { in: packageIds },
            status: 'active',
            OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
          },
          select: { package_id: true },
        })
        : [];

    // Create a fast lookup set of active package IDs the user has access to
    const activePackageIdSet = new Set(activeAccesses.map((acc) => acc.package_id));

    // 3. Map notes to items with exact locked status check
    const items = notes.map((note) => {
      const isFree = note.tier === NoteTier.free;
      const isDirectlyPurchased = note.note_purchases.length > 0;

      // Check if the user has active access to ANY package linked to this note
      const hasPackageAccess = note.packages.some((pkg) =>
        activePackageIdSet.has(pkg.id),
      );

      // Locked if it's premium, not free, not directly purchased, and user doesn't have package clearance
      const is_locked = !isFree && !isDirectlyPurchased && !hasPackageAccess;

      return {
        id: note.id,
        title: note.title,
        description: note.description,
        subject: note.subject,
        tier: note.tier,
        price: note.price.toNumber(),
        discount_price: note.discount_price.toNumber(),
        file_mime: note.file_mime,
        preview_file_path: note.preview_file_path,
        preview_file_mime: note.preview_file_mime,
        packages: note.packages,
        download_count: note.download_count,
        is_locked,
        created_at: note.created_at,
      };
    });

    return {
      items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async findOneForUser(id: string, userId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: {
        packages: { select: { id: true, title: true } },
        note_purchases: {
          where: { user_id: userId, status: NotePurchaseStatus.paid },
          select: { id: true },
        },
      },
    });

    if (!note || !note.is_published) {
      throw new NotFoundException('Note not found');
    }

    const isFree = note.tier === NoteTier.free;
    const isDirectlyPurchased = note.note_purchases.length > 0;

    // Check if the user has an active access to any of the packages linked to this note
    let hasPackageAccess = false;
    if (note.packages.length > 0) {
      const packageIds = note.packages.map((p) => p.id);
      const activeAccess = await this.prisma.userPackageAccess.findFirst({
        where: {
          user_id: userId,
          package_id: { in: packageIds },
          status: 'active',
          OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
        },
      });
      hasPackageAccess = !!activeAccess;
    }

    const is_locked = !isFree && !isDirectlyPurchased && !hasPackageAccess;

    if (is_locked) {
      throw new ForbiddenException('This note is locked. You must purchase it or have an active package subscription to view its full details.');
    }

    return {
      id: note.id,
      title: note.title,
      description: note.description,
      subject: note.subject,
      tier: note.tier,
      price: note.price.toNumber(),
      discount_price: note.discount_price.toNumber(),
      file_path: note.file_path,
      file_mime: note.file_mime,
      preview_file_path: note.preview_file_path,
      preview_file_mime: note.preview_file_mime,
      packages: note.packages,
      download_count: note.download_count,
      is_locked: false,
      created_at: note.created_at,
    };
  }

  async downloadNoteFile(id: string, userId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { packages: { select: { id: true } } },
    });

    if (!note || !note.is_published) throw new NotFoundException('Note not found');

    if (note.tier === NoteTier.premium) {
      const packageIds = note.packages.map((p) => p.id);

      // Check package access or direct note purchase
      const [hasPackageAccess, directPurchase] = await Promise.all([
        packageIds.length > 0
          ? this.prisma.userPackageAccess.findFirst({
            where: { user_id: userId, package_id: { in: packageIds }, status: 'active' },
          })
          : null,
        this.prisma.notePurchase.findFirst({
          where: { user_id: userId, note_id: id, status: NotePurchaseStatus.paid },
        }),
      ]);

      if (!hasPackageAccess && !directPurchase) {
        throw new ForbiddenException('Access denied. You must purchase this note or unlock via package access.');
      }
    }

    // Increment download count asynchronously
    await this.prisma.note.update({
      where: { id },
      data: { download_count: { increment: 1 } },
      select: { title: true, file_path: true, file_mime: true },
    });

    return {
      file_path: note.file_path,
      file_mime: note.file_mime,
      title: note.title,
    };
  }
}