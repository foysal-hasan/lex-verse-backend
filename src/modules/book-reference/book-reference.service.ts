import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookReferenceDto } from './dto/create-book-reference.dto';
import { UpdateBookReferenceDto } from './dto/update-book-reference.dto';
import { QueryBookReferenceDto } from './dto/query-book-reference.dto';
import { PkgAccStatus } from 'src/generated/prisma/enums';


@Injectable()
export class BookReferenceService {
  constructor(private readonly prisma: PrismaService) {}

  // -------------------------------------------------------------
  // ADMIN: Create Book Reference with Optional Package Attachments
  // -------------------------------------------------------------
  async create(dto: CreateBookReferenceDto, userId?: string) {
    const { package_ids, ...rest } = dto;

    return this.prisma.bookReference.create({
      data: {
        ...rest,
        created_by: userId,
        packages:
          package_ids && package_ids.length > 0
            ? { connect: package_ids.map((id) => ({ id })) }
            : undefined,
      },
      include: {
        packages: { select: { id: true, title: true } },
      },
    });
  }

  // -------------------------------------------------------------
  // ADMIN: List All Book References (Unconstrained)
  // -------------------------------------------------------------
  async findAllAdmin(query: any) {
    const { page = 1, limit = 10, search, program_type, track, category } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = { deleted_at: null };
    if (program_type) where.program_type = { has: program_type };
    if (track) where.track = { has: track };
    if (category) where.category = { has: category };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.bookReference.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          packages: { select: { id: true, title: true, program: true } },
        },
      }),
      this.prisma.bookReference.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  // -------------------------------------------------------------
  // ADMIN & GENERAL: Find Single Book Reference by ID
  // -------------------------------------------------------------
  async findOne(id: string) {
    const book = await this.prisma.bookReference.findFirst({
      where: { id, deleted_at: null },
      include: {
        packages: { select: { id: true, title: true, program: true } },
      },
    });

    if (!book) {
      throw new NotFoundException('Book reference not found');
    }

    return book;
  }

  // -------------------------------------------------------------
  // ADMIN: Update Book Reference
  // -------------------------------------------------------------
  async update(id: string, dto: UpdateBookReferenceDto) {
    await this.findOne(id);

    return this.prisma.bookReference.update({
      where: { id },
      data: dto,
      include: { packages: { select: { id: true, title: true } } },
    });
  }

  // -------------------------------------------------------------
  // ADMIN: Soft Delete Book Reference
  // -------------------------------------------------------------
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.bookReference.update({
      where: { id },
      data: { deleted_at: new Date(), is_published: false },
    });
  }

  // -------------------------------------------------------------
  // ADMIN: Attach Book Reference to a Package
  // -------------------------------------------------------------
  async assignToPackage(bookId: string, packageId: string) {
    await this.findOne(bookId);
    const pkg = await this.prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) throw new NotFoundException('Package not found');

    return this.prisma.bookReference.update({
      where: { id: bookId },
      data: {
        packages: { connect: { id: packageId } },
      },
      include: { packages: { select: { id: true, title: true } } },
    });
  }

  // -------------------------------------------------------------
  // ADMIN: Detach Book Reference from a Package
  // -------------------------------------------------------------
  async removeFromPackage(bookId: string, packageId: string) {
    await this.findOne(bookId);

    return this.prisma.bookReference.update({
      where: { id: bookId },
      data: {
        packages: { disconnect: { id: packageId } },
      },
      include: { packages: { select: { id: true, title: true } } },
    });
  }

  // -------------------------------------------------------------
  // USER: Fetch by Mandatory Package ID with Purchase Validation
  // This version return only purchased resources
  // -------------------------------------------------------------
  // async findAllForUser(userId: string, query: QueryBookReferenceDto) {
  //   const { page = 1, limit = 10, package_id, search, category, track } = query;
  //   const skip = (page - 1) * limit;

  //   // 1. Validate that the target package exists
  //   const pkg = await this.prisma.package.findUnique({ where: { id: package_id } });
  //   if (!pkg) {
  //     throw new NotFoundException('Package not found');
  //   }

  //   // 2. Validate if the user has active access to this package
  //   const userAccess = await this.prisma.userPackageAccess.findUnique({
  //     where: {
  //       user_id_package_id: {
  //         user_id: userId,
  //         package_id: package_id,
  //       },
  //     },
  //   });

  //   const hasActivePurchase =
  //     userAccess &&
  //     userAccess.status === PkgAccStatus.active &&
  //     (!userAccess.expires_at || new Date(userAccess.expires_at) > new Date());

  //   // 3. Construct base query filters
  //   const where: Record<string, any> = {
  //     deleted_at: null,
  //     is_published: true,
  //     packages: { some: { id: package_id } },
  //   };

  //   if (category) where.category = { has: category };
  //   if (track) where.track = { has: track };
  //   if (search) {
  //     where.OR = [
  //       { title: { contains: search, mode: 'insensitive' } },
  //       { content: { contains: search, mode: 'insensitive' } },
  //     ];
  //   }

  //   // 4. If user does NOT have an active purchase, restrict them to public resources only
  //   if (!hasActivePurchase) {
  //     where.requires_purchase = false;
  //   }

  //   const [items, total] = await Promise.all([
  //     this.prisma.bookReference.findMany({
  //       where,
  //       skip,
  //       take: limit,
  //       orderBy: { created_at: 'desc' },
  //       select: {
  //         id: true,
  //         title: true,
  //         content: true,
  //         category: true,
  //         track: true,
  //         program_type: true,
  //         requires_purchase: true,
  //         created_at: true,
  //       },
  //     }),
  //     this.prisma.bookReference.count({ where }),
  //   ]);

  //   return {
  //     items,
  //     has_active_purchase: !!hasActivePurchase,
  //     meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
  //   };
  // }


  // -------------------------------------------------------------
  // USER: Fetch All Book References for Package with Lock/Content Control
  // -------------------------------------------------------------
  async findAllForUser(userId: string, query: QueryBookReferenceDto) {
    const { page = 1, limit = 10, package_id, search, category, track } = query;
    const skip = (page - 1) * limit;

    // 1. Validate that the target package exists
    const pkg = await this.prisma.package.findUnique({ where: { id: package_id } });
    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    // 2. Validate if the user has active access to this package
    const userAccess = await this.prisma.userPackageAccess.findUnique({
      where: {
        user_id_package_id: {
          user_id: userId,
          package_id: package_id,
        },
      },
    });

    const hasActivePurchase =
      userAccess &&
      userAccess.status === PkgAccStatus.active &&
      (!userAccess.expires_at || new Date(userAccess.expires_at) > new Date());

    // 3. Construct base query filters (Returns ALL published books for this package)
    const where: Record<string, any> = {
      deleted_at: null,
      is_published: true,
      packages: { some: { id: package_id } },
    };

    if (category) where.category = { has: category };
    if (track) where.track = { has: track };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [rawItems, total] = await Promise.all([
      this.prisma.bookReference.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'asc' },
        select: {
          id: true,
          title: true,
          category: true,
          track: true,
          program_type: true,
          requires_purchase: true,
          created_at: true,
        },
      }),
      this.prisma.bookReference.count({ where }),
    ]);

    // 4. Map items to include the `is_locked` flag and protect content if locked
    const items = rawItems.map((book) => {
      const is_locked = book.requires_purchase && !hasActivePurchase;

      return {
        id: book.id,
        title: book.title,
        category: book.category,
        track: book.track,
        program_type: book.program_type,
        requires_purchase: book.requires_purchase,
        created_at: book.created_at,
        is_locked,
      };
    });

    return {
      items,
      has_active_purchase: !!hasActivePurchase,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  // -------------------------------------------------------------
  // USER: Single View with Strict Purchase Security Check
  // -------------------------------------------------------------
  async findOneForUser(id: string, userId: string) {
    const book = await this.prisma.bookReference.findFirst({
      where: { id, deleted_at: null, is_published: true },
      include: { packages: { select: { id: true } } },
    });

    if (!book) {
      throw new NotFoundException('Book reference not found');
    }

    // If the book requires a purchase, verify the user has an active grant to at least one of its linked packages
    if (book.requires_purchase) {
      const packageIds = book.packages.map((p) => p.id);
      const access = await this.prisma.userPackageAccess.findFirst({
        where: {
          user_id: userId,
          package_id: { in: packageIds },
          status: PkgAccStatus.active,
          OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
        },
      });

      if (!access) {
        throw new ForbiddenException(
          'You must purchase and maintain an active package to view this restricted book reference.',
        );
      }
    }

    return book;
  }
}