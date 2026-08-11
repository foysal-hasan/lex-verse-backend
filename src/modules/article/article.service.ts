import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryAdminArticleDto, QueryArticleDto } from './dto/query.article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) { }

  // --- ADMIN: CRUD ---

  async create(dto: CreateArticleDto) {
    // Check if custom slug already exists
    const existingSlug = await this.prisma.article.findUnique({ where: { slug: dto.slug } });
    if (existingSlug) {
      throw new ConflictException(`Slug "${dto.slug}" is already taken. Please choose a unique slug.`);
    }

    return this.prisma.article.create({
      data: {
        ...dto,
        slug: dto.slug,
        author_id: dto.user_id,
        published_at: dto.is_published ? new Date() : null,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar_url: true },
        },
      },
    });
  }

  async findAllForAdmin(query: QueryAdminArticleDto) {
    const { page = 1, limit = 10, search, category, tag, is_published } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};

    if (is_published !== undefined) where.is_published = is_published;
    if (category) where.category = category;
    if (tag) where.tags = { has: tag };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar_url: true },
          },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async update(id: string, dto: UpdateArticleDto) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');

    const updateData: any = { ...dto };

    if (dto.slug && dto.slug !== article.slug) {
      const existingSlug = await this.prisma.article.findUnique({ where: { slug: dto.slug } });
      if (existingSlug) {
        throw new ConflictException(`Slug "${dto.slug}" is already taken. Please choose a unique slug.`);
      }
      updateData.slug = dto.slug;
    }

    if (dto.is_published === true && !article.is_published) {
      updateData.published_at = new Date();
    } else if (dto.is_published === false) {
      updateData.published_at = null;
    }

    return this.prisma.article.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');

    return this.prisma.article.delete({ where: { id } });
  }

  // --- USER: Read with filter, pagination & Get Tags ---

  async findAllPublishedForUser(query: QueryArticleDto) {
    const { page = 1, limit = 10, search, category, tag } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {
      is_published: true,
    };

    if (category) where.category = category;
    if (tag) where.tags = { has: tag };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { published_at: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, avatar_url: true, designation: true, credential: true, },
          },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async findOneBySlugForUser(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug, is_published: true },
      include: {
        user: {
          select: { 
            id: true, 
            created_at: true,
            updated_at: true,
            name: true, 
            email: true,
            avatar_url: true, 
            designation: true, 
            credential: true, 
            linkedin: true,
            twitter: true,
            facebook: true,
            instagram: true,
          }
        },
      },
    });

    if (!article) throw new NotFoundException('Article not found');

    await this.prisma.article.update({
      where: { id: article.id },
      data: { view_count: { increment: 1 } },
    }).catch(() => { });

    return article;
  }

  async getAllTags() {
    const articles = await this.prisma.article.findMany({
      where: { is_published: true },
      select: { tags: true },
    });

    const tagSet = new Set<string>();
    articles.forEach((art) => art.tags?.forEach((t) => tagSet.add(t)));

    return Array.from(tagSet);
  }
}