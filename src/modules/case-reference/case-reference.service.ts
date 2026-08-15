import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueueDispatcherService } from 'src/common/queue/queue-dispatcher.service';
import { FILE_UPLOAD_JOBS } from '../file-upload/constants/file-upload.constants';
import { CreateCaseReferenceDto } from './dto/create-case-reference.dto';
import { UpdateCaseReferenceDto } from './dto/update-case-reference.dto';
import { QueryCaseReferenceDto } from './dto/query-case-reference.dto';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import appConfig from 'src/config/app.config';

@Injectable()
export class CaseReferenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueDispatcher: QueueDispatcherService,
  ) {}

  // -------------------------------------------------------------
  // HELPER: Slug Generator
  // -------------------------------------------------------------
  private async generateUniqueSlug(title: string, currentId?: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    let slug = baseSlug;
    let count = 1;

    while (true) {
      const existing = await this.prisma.caseReference.findFirst({
        where: {
          slug,
          deleted_at: null,
          ...(currentId ? { NOT: { id: currentId } } : {}),
        },
        select: { id: true },
      });

      if (!existing) break;
      slug = `${baseSlug}-${count}`;
      count++;
    }

    return slug;
  }

  // -------------------------------------------------------------
  // HELPER: Track Files for BullMQ
  // -------------------------------------------------------------
  private async enqueueAttachedFiles(dto: Partial<CreateCaseReferenceDto>) {
    const fileUrls: string[] = [];
    if (dto.pdf_path) fileUrls.push(dto.pdf_path);
    if (dto.cover_image) fileUrls.push(dto.cover_image);

    if (fileUrls.length > 0) {
      await this.queueDispatcher.enqueueFileAttachment(
        FILE_UPLOAD_JOBS.MARK_ATTACHED,
        { urls: fileUrls },
      );
    }
  }

  // -------------------------------------------------------------
  // ADMIN: Create Case Reference
  // -------------------------------------------------------------
  async create(dto: CreateCaseReferenceDto) {
    const slug = await this.generateUniqueSlug(dto.case_title);

    const caseReference = await this.prisma.caseReference.create({
      data: {
        ...dto,
        slug,
        published_at: dto.is_published ? new Date() : null,
      },
    });

    await this.enqueueAttachedFiles(dto);

    return caseReference;
  }

  // -------------------------------------------------------------
  // PUBLIC / USER: List Case References
  // -------------------------------------------------------------
  async findAll(query: QueryCaseReferenceDto, isAdmin = false) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      court,
      year,
      tag,
      is_published,
      sort_by,
      sort_order,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CaseReferenceWhereInput = {
      deleted_at: null,
    };

    if (!isAdmin) {
      where.is_published = true;
    } else if (is_published !== undefined) {
      where.is_published = is_published;
    }

    if (category) where.category = { equals: category, mode: 'insensitive' };
    if (court) where.court = { equals: court, mode: 'insensitive' };
    if (year) where.year = year;
    if (tag) where.tags = { has: tag };

    if (search) {
      where.OR = [
        { case_title: { contains: search, mode: 'insensitive' } },
        { citation: { contains: search, mode: 'insensitive' } },
        { court: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content_plain: { contains: search, mode: 'insensitive' } },
      ];
    }

    

    const [data, total] = await Promise.all([
      this.prisma.caseReference.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort_by]: sort_order },
        select: {
          id: true,
          case_title: true,
          slug: true,
          citation: true,
          court: true,
          year: true,
          summary: true,
          cover_image: true,
          pdf_path: true,
          pdf_url: true,
          category: true,
          tags: true,
          is_published: true,
          published_at: true,
          created_at: true,
        },
      }),
      this.prisma.caseReference.count({ where }),
    ]);


    return {
      items: data,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // -------------------------------------------------------------
  // GET ONE BY ID OR SLUG
  // -------------------------------------------------------------
  async findOne(identifier: string, isAdmin = false) {
    const caseRef = await this.prisma.caseReference.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
        deleted_at: null,
      },
    });

    if (!caseRef) {
      throw new NotFoundException(`Case Reference '${identifier}' not found`);
    }

    if (!isAdmin && !caseRef.is_published) {
      throw new NotFoundException(`Case Reference '${identifier}' not found`);
    }

    return caseRef;
  }

  // -------------------------------------------------------------
  // ADMIN: Update Case Reference
  // -------------------------------------------------------------
  async update(id: string, dto: UpdateCaseReferenceDto) {
    const existing = await this.findOne(id, true);

    let slug = existing.slug;
    if (dto.case_title && dto.case_title !== existing.case_title) {
      slug = await this.generateUniqueSlug(dto.case_title, id);
    }

    const updated = await this.prisma.caseReference.update({
      where: { id: existing.id },
      data: {
        ...dto,
        slug,
        updated_at: new Date(),
        published_at:
          dto.is_published === true && !existing.published_at
            ? new Date()
            : existing.published_at,
      },
    });

    await this.enqueueAttachedFiles(dto);

    return updated;
  }

  // -------------------------------------------------------------
  // ADMIN: Soft Delete
  // -------------------------------------------------------------
  async remove(id: string, adminUserId: string) {
    await this.findOne(id, true);

    return this.prisma.caseReference.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: adminUserId,
        is_published: false,
      },
    });
  }

  // -------------------------------------------------------------
  // USER: PDF Download
  // -------------------------------------------------------------
  async getDownloadFile(identifier: string) {
    const caseRef = await this.findOne(identifier, false);

    const targetPath = caseRef.pdf_path || caseRef.pdf_url;
    if (!targetPath) {
      throw new BadRequestException('No PDF available for this Case Reference');
    }

    // Update download count
    await this.prisma.caseReference.update({
      where: { id: caseRef.id },
      data: {
        download_count: {
          increment: 1,
        },
      },
    });

    return {
      file_path: targetPath,
      filename: `${(caseRef.slug || 'case-reference')}.pdf`,
      type: 'application/pdf',
    };
  }

  // -------------------------------------------------------------
  // UNIQUE FILTER OPTIONS
  // -------------------------------------------------------------
  async getUniqueCategories(): Promise<string[]> {
    const categories = await this.prisma.caseReference.findMany({
      where: { deleted_at: null, category: { not: null } },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return categories
      .map((item) => item.category)
      .filter((cat): cat is string => Boolean(cat));
  }

  async getUniqueCourts(): Promise<string[]> {
    const courts = await this.prisma.caseReference.findMany({
      where: { deleted_at: null, court: { not: null } },
      select: { court: true },
      distinct: ['court'],
      orderBy: { court: 'asc' },
    });

    return courts
      .map((item) => item.court)
      .filter((c): c is string => Boolean(c));
  }
}