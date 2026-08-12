import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryAdminArticleDto, QueryArticleDto } from './dto/query.article.dto';
import { Storage } from 'src/common/lib/Disk/Storage';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) { }

  // --- ADMIN: CRUD ---

  async create(dto: CreateArticleDto) {
    const author = await this.prisma.user.findUnique({ where: { id: dto.author_id } });
    if (!author) throw new NotFoundException('Author not found');

    // Check if custom slug already exists
    const existingSlug = await this.prisma.article.findUnique({ where: { slug: dto.slug } });
    if (existingSlug) {
      throw new ConflictException(`Slug "${dto.slug}" is already taken. Please choose a unique slug.`);
    }

    return this.prisma.article.create({
      data: {
        ...dto,
        slug: dto.slug,
        published_at: dto.is_published ? new Date() : null,
      },
      include: {
        author: {
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
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          category: true,
          published_at: true,
          view_count: true,
          tags: true,
          banner_image: true,
          cover_image: true,
          author: {
            select: {
              id: true,
              name: true,
              avatar_url: true,
              designation: true,
              credential: true,
            },
          },
        }
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
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar_url: true },
        },
      },
    });
  }

  async remove(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');

    // Delete the banner image and cover image from the storage
    if (article.banner_image) {
      await Storage.delete(article.banner_image);
    }
    if (article.cover_image) {
      await Storage.delete(article.cover_image);
    }

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
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          category: true,
          published_at: true,
          banner_image: true,
          cover_image: true,
          view_count: true,
          tags: true,
          author: {
            select: {
              id: true,
              name: true,
              avatar_url: true,
              designation: true,
              credential: true,
            },
          },
        }
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
        author: {
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