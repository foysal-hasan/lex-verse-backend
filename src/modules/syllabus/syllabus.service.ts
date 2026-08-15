import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSyllabusDto } from './dto/create-syllabus.dto';
import { UpdateSyllabusDto } from './dto/update-syllabus.dto';
import { QuerySyllabusDto } from './dto/query-syllabus.dto';
import { Storage } from 'src/common/lib/Disk/Storage';

@Injectable()
export class SyllabusService {
  constructor(private readonly prisma: PrismaService) {}

  // ================= ADMIN METHODS =================
  async create(dto: CreateSyllabusDto) {
    const { package_ids, ...rest } = dto;
    return this.prisma.syllabus.create({
      data: {
        ...rest,
        packages: package_ids && package_ids.length > 0 ? { connect: package_ids.map((id) => ({ id })) } : undefined,
      },
      include: { packages: { select: { id: true, title: true } } },
    });
  }

  async findAllAdmin(query: QuerySyllabusDto) {
    const { page = 1, limit = 10, search, track, package_id, sort_by = 'created_at', sort_order = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};
    if (track) where.track = track;
    if (package_id) where.packages = { some: { id: package_id } };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.syllabus.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort_by]: sort_order },
        include: { packages: { select: { id: true, title: true } } },
      }),
      this.prisma.syllabus.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async findOneAdmin(id: string) {
    const syllabus = await this.prisma.syllabus.findUnique({
      where: { id },
      include: { packages: { select: { id: true, title: true } } },
    });
    if (!syllabus) throw new NotFoundException('Syllabus not found');
    return syllabus;
  }

  async update(id: string, dto: UpdateSyllabusDto) {
    await this.findOneAdmin(id);
    const { package_ids, ...rest } = dto;

    return this.prisma.syllabus.update({
      where: { id },
      data: {
        ...rest,
        packages: package_ids ? { set: package_ids.map((pkgId) => ({ id: pkgId })) } : undefined,
      },
      include: { packages: { select: { id: true, title: true } } },
    });
  }

  async remove(id: string) {
    await this.findOneAdmin(id);
    const syllabus = await this.prisma.syllabus.delete({ where: { id } , select: { id: true, file_path: true } });
    if(syllabus.file_path) {
      await Storage.delete(syllabus.file_path);
    }
    return {
      id: syllabus.id,
    };
  }

  async attachPackages(syllabusId: string, packageIds: string[]) {
    await this.findOneAdmin(syllabusId);
    return this.prisma.syllabus.update({
      where: { id: syllabusId },
      data: { packages: { connect: packageIds.map((id) => ({ id })) } },
      include: { packages: { select: { id: true, title: true } } },
    });
  }

  async detachPackages(syllabusId: string, packageIds: string[]) {
    await this.findOneAdmin(syllabusId);
    return this.prisma.syllabus.update({
      where: { id: syllabusId },
      data: { packages: { disconnect: packageIds.map((id) => ({ id })) } },
      include: { packages: { select: { id: true, title: true } } },
    });
  }

  // ================= USER METHODS =================
  async findAllForUser(userId: string, query: QuerySyllabusDto) {
    const { page = 1, limit = 10, search, track, package_id, sort_by = 'created_at', sort_order = 'desc' } = query;

    if (!package_id) {
      throw new BadRequestException('A specific package_id is required to view syllabuses.');
    }

    // Verify user has active access to the specified package
    // const activeAccess = await this.prisma.userPackageAccess.findFirst({
    //   where: {
    //     user_id: userId,
    //     package_id,
    //     status: 'active',
    //     OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
    //   },
    // });

    // if (!activeAccess) {
    //   throw new ForbiddenException('Access denied. You do not have an active subscription to this package.');
    // }

    const skip = (page - 1) * limit;
    const where: Record<string, any> = {
      is_published: true,
      packages: { some: { id: package_id } },
    };

    if (track) where.track = track;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.syllabus.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort_by]: sort_order },
        include: { packages: { select: { id: true, title: true } } },
      }),
      this.prisma.syllabus.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async findOneForUser(id: string, userId: string) {
    const syllabus = await this.prisma.syllabus.findUnique({
      where: { id },
      include: { packages: { select: { id: true, title: true } } },
    });

    if (!syllabus || !syllabus.is_published) {
      throw new NotFoundException('Syllabus not found');
    }

    // const packageIds = syllabus.packages.map((p) => p.id);
    // if (packageIds.length === 0) {
    //   throw new ForbiddenException('This syllabus is not linked to any package.');
    // }

    // // Check if user has active access to at least one package linked to this syllabus
    // const activeAccess = await this.prisma.userPackageAccess.findFirst({
    //   where: {
    //     user_id: userId,
    //     package_id: { in: packageIds },
    //     status: 'active',
    //     OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
    //   },
    // });

    // if (!activeAccess) {
    //   throw new ForbiddenException('Access denied. You must have an active subscription to a package containing this syllabus.');
    // }

    return syllabus;
  }
}