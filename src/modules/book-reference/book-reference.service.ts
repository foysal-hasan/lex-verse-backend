import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookReferenceDto } from './dto/create-book-reference.dto';
import { UpdateBookReferenceDto } from './dto/update-book-reference.dto';
import { QueryBookReferenceDto } from './dto/query-book-reference.dto';
import { BOOK_REFERENCE_CONFIG } from './config/book-reference.config';
import { PkgReqStatus } from 'src/generated/prisma/enums';

@Injectable()
export class BookReferenceService {
  constructor(private readonly prisma: PrismaService) { }

  // -------------------------------------------------------------
  // ADMIN: Create Book Reference
  // -------------------------------------------------------------
  async create(userId: string, dto: CreateBookReferenceDto) {
    return this.prisma.bookReference.create({
      data: {
        ...dto,
        created_by: userId,
      },
    });
  }

  // -------------------------------------------------------------
  // LIST / SEARCH BOOK REFERENCES (With Package Purchase Check)
  // -------------------------------------------------------------
  async findAll(query: QueryBookReferenceDto, userId?: string, isAdmin = false) {
    const { page = 1, limit = 10, search, package_id, program_type, track, category, is_published } = query;
    const skip = (page - 1) * limit;

    // If regular user, check package purchase requirement
    if (!isAdmin && BOOK_REFERENCE_CONFIG.REQUIRE_PACKAGE_PURCHASE) {
      if (!package_id) {
        throw new BadRequestException('A package_id is required to fetch book references.');
      }
      if (!userId) {
        throw new ForbiddenException('Authentication required to access package references.');
      }

      await this.verifyUserPackagePurchase(userId, package_id);
    }

    const where: Record<string, any> = { deleted_at: null };

    if (!isAdmin) {
      where.is_published = true;
    } else if (is_published !== undefined) {
      where.is_published = is_published;
    }

    // Filter by package relationship if package_id is provided
    if (package_id) {
      where.packages = {
        some: { id: package_id },
      };
    }

    if (program_type) {
      where.program_type = { has: program_type };
    }

    if (track) {
      where.track = { has: track };
    }

    if (category) {
      where.category = { has: category };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.bookReference.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.bookReference.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // -------------------------------------------------------------
  // GET ONE
  // -------------------------------------------------------------
  async findOne(id: string, userId?: string, package_id?: string, isAdmin = false) {
    const bookRef = await this.prisma.bookReference.findFirst({
      where: {
        id,
        deleted_at: null,
        ...(package_id ? { packages: { some: { id: package_id } } } : {}),
      },
      include: {
        packages: true,
      },
    });

    if (!bookRef) {
      throw new NotFoundException(`Book reference '${id}' not found or not linked to the specified package.`);
    }

    if (!isAdmin) {
      if (!bookRef.is_published) {
        throw new NotFoundException(`Book reference '${id}' not found`);
      }

      // Check purchase validation if enabled and package_id is present
      if (BOOK_REFERENCE_CONFIG.REQUIRE_PACKAGE_PURCHASE && package_id) {
        if (!userId) {
          throw new ForbiddenException('Authentication required.');
        }
        await this.verifyUserPackagePurchase(userId, package_id);
      }
    }

    return bookRef;
  }

  // -------------------------------------------------------------
  // HELPER: Verify if user has active package access
  // -------------------------------------------------------------
  private async verifyUserPackagePurchase(userId: string, packageId: string): Promise<void> {
    const userAccess = await this.prisma.userPackageAccess.findFirst({
      where: {
        user_id: userId,
        package_id: packageId,
        status: 'active', // Matches PkgAccStatus enum value
        OR: [
          { expires_at: null }, // Lifetime or non-expiring access
          { expires_at: { gt: new Date() } }, // Access has not expired yet
        ],
      },
    });

    if (!userAccess) {
      throw new ForbiddenException('You do not have an active subscription or access to this package.');
    }
  }

  // -------------------------------------------------------------
  // ADMIN: Update
  // -------------------------------------------------------------
  async update(id: string, dto: UpdateBookReferenceDto) {
    await this.findOne(id, undefined, undefined, true);

    return this.prisma.bookReference.update({
      where: { id },
      data: dto,
    });
  }

  // -------------------------------------------------------------
  // ADMIN: Soft Delete
  // -------------------------------------------------------------
  async remove(id: string) {
    await this.findOne(id, undefined, undefined, true);

    return this.prisma.bookReference.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        is_published: false,
      },
    });
  }
}