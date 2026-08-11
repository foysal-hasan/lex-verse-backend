import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
import { QuerySuggestionDto } from './dto/query-suggestion.dto';
import { PkgAccStatus } from 'src/generated/prisma/enums';
import { Prisma } from 'src/generated/prisma/client';


@Injectable()
export class SuggestionService {
  constructor(private readonly prisma: PrismaService) { }

  // ==========================================
  // ADMIN METHODS
  // ==========================================

  async create(dto: CreateSuggestionDto, userId?: string) {
    const { package_ids, children, ...rest } = dto;

    // Helper mapper to recursively construct nested children data for Prisma
    const mapChildren = (subList?: CreateSuggestionDto[]): any => {
      if (!subList || subList.length === 0) return undefined;
      return {
        create: subList.map((child) => {
          const { package_ids: childPkgIds, children: subChildren, ...childRest } = child;
          return {
            ...childRest,
            created_by: userId,
            packages: childPkgIds && childPkgIds.length > 0 ? { connect: childPkgIds.map((id) => ({ id })) } : undefined,
            children: mapChildren(subChildren),
          };
        }),
      };
    };

    return this.prisma.suggestions.create({
      data: {
        ...rest,
        created_by: userId,
        packages: package_ids && package_ids.length > 0 ? { connect: package_ids.map((id) => ({ id })) } : undefined,
        children: mapChildren(children),
      },
      include: {
        children: { include: { children: true } },
        packages: { select: { id: true, title: true } },
      },
    });
  }

  async findAllAdmin(query: QuerySuggestionDto) {
    const { page = 1, limit = 10, search, category, package_id } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.SuggestionsWhereInput = { deleted_at: null, parent_id: null }; // Fetch root items, children can be nested
    if (category) where.category = category;
    if (package_id) where.packages = { some: { id: package_id } };
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this.prisma.suggestions.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          children: {
            where: { deleted_at: null },
            include: { children: true },
          },
          packages: { select: { id: true, title: true } },
        },
      }),
      this.prisma.suggestions.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async findOneAdmin(id: string) {
    const suggestion = await this.prisma.suggestions.findFirst({
      where: { id, deleted_at: null },
      include: {
        children: {
          where: { deleted_at: null },
          include: { children: true },
        },
        packages: { select: { id: true, title: true } },
      },
    });

    if (!suggestion) throw new NotFoundException('Suggestion not found');
    return suggestion;
  }

  async update(id: string, dto: UpdateSuggestionDto) {
    await this.findOneAdmin(id);

    const { package_ids, children, parent_id, ...rest } = dto;

    return this.prisma.suggestions.update({
      where: { id },
      data: {
        ...rest,
        parent_id: parent_id !== undefined ? parent_id : undefined,
        packages: package_ids ? { set: package_ids.map((pkgId) => ({ id: pkgId })) } : undefined,
      },
      include: {
        packages: { select: { id: true, title: true } },
        children: { where: { deleted_at: null } },
      },
    });
  }

  async toggleActiveStatus(id: string, is_active: boolean) {
    await this.findOneAdmin(id);
    return this.prisma.suggestions.update({
      where: { id },
      data: { is_active },
    });
  }

  // Soft delete parent and recursively cascade soft-delete to all children
  async remove(id: string) {
    await this.findOneAdmin(id);

    const now = new Date();
    // Helper to soft-delete recursively
    const cascadeSoftDelete = async (suggestionId: string) => {
      const children = await this.prisma.suggestions.findMany({
        where: { parent_id: suggestionId, deleted_at: null },
        select: { id: true },
      });

      for (const child of children) {
        await cascadeSoftDelete(child.id);
      }

      await this.prisma.suggestions.update({
        where: { id: suggestionId },
        data: { deleted_at: now, is_active: false },
      });
    };

    await cascadeSoftDelete(id);
    return { message: 'Suggestion and all sub-suggestions successfully deleted.' };
  }

  // ==========================================
  // USER METHODS
  // ==========================================
  // User view list: Titles and basic metadata ONLY, without content
  async findAllForUser(userId: string, query: QuerySuggestionDto) {
    const { page = 1, limit = 10, package_id, search, category, track, program_type } = query;
    const skip = (page - 1) * limit;

    if (!package_id) {
      throw new BadRequestException('Package ID is required');
    }
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

    // 3. Construct base query filters (Returns active suggestions connected to this package)
    const where: Prisma.SuggestionsWhereInput = {
      deleted_at: null,
      is_active: true,
      packages: { some: { id: package_id } },
      parent_id: null, 
    };

    if (category) where.category = category; // or { has: category } if stored as an array
    if (track) where.tracks = { has: track };
    if (program_type) where.program_types = { has: program_type };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [rawItems, total] = await Promise.all([
      this.prisma.suggestions.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'asc' },
        select: {
          id: true,
          parent_id: true,
          title: true,
          category: true,
          tracks: true,
          program_types: true,
          requires_purchase: true,
          created_at: true,
          children: {
            where: { is_active: true, deleted_at: null },
            select: {
              id: true,
              title: true,
              category: true,
              requires_purchase: true,
            }
          }
        },
      }),
      this.prisma.suggestions.count({ where }),
    ]);

    // 4. Map items to include the `is_unlock` flag (or `is_locked`, depending on your naming preference)
    const items = rawItems.map((suggestion) => {
      // If requires_purchase is true, unlock depends on whether user has an active purchase
      const is_unlock = suggestion.requires_purchase ? hasActivePurchase : true;

      return {
        id: suggestion.id,
        parent_id: suggestion.parent_id,
        title: suggestion.title,
        category: suggestion.category,
        tracks: suggestion.tracks,
        program_types: suggestion.program_types,
        requires_purchase: suggestion.requires_purchase,
        created_at: suggestion.created_at,
        is_unlock, // Matches your requirement
        children: suggestion.children || [],
      };
    });

    return {
      items,
      has_active_purchase: !!hasActivePurchase,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      },
    };
  }

  // User find one: See full content if requires_purchase is false OR user bought related package
  async findOneForUser(id: string, userId: string) {
    const suggestion = await this.prisma.suggestions.findFirst({
      where: { id, deleted_at: null, is_active: true },
      include: {
        packages: { select: { id: true } },
        children: {
          where: { deleted_at: null, is_active: true },
          include: { children: true },
        },
      },
    });

    if (!suggestion) throw new NotFoundException('Suggestion not found');

    if (suggestion.requires_purchase) {
      const packageIds = suggestion.packages.map((p) => p.id);

      const hasAccess = await this.prisma.userPackageAccess.findFirst({
        where: {
          user_id: userId,
          package_id: { in: packageIds },
          status: PkgAccStatus.active,
          OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
        },
      });

      if (!hasAccess) {
        throw new ForbiddenException('You must purchase an active package linked to this suggestion to view its content.');
      }
    }

    return suggestion;
  }


  async attachPackage(suggestionId: string, packageId: string) {
    const [suggestion, pkg] = await Promise.all([
      this.prisma.suggestions.findUnique({ where: { id: suggestionId } }),
      this.prisma.package.findUnique({ where: { id: packageId } }),
    ]);

    if (!suggestion) throw new NotFoundException('Suggestion not found');
    if (!pkg) throw new NotFoundException('Package not found');

    return this.prisma.suggestions.update({
      where: { id: suggestionId },
      data: {
        packages: {
          connect: { id: packageId },
        },
      },
      include: {
        packages: true,
      },
    });
  }

  async detachPackage(suggestionId: string, packageId: string) {
    const suggestion = await this.prisma.suggestions.findUnique({ 
      where: { id: suggestionId } 
    });

    if (!suggestion) throw new NotFoundException('Suggestion not found');

    return this.prisma.suggestions.update({
      where: { id: suggestionId },
      data: {
        packages: {
          disconnect: { id: packageId },
        },
      },
      include: {
        packages: true,
      },
    });
  }
}