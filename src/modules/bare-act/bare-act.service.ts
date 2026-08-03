import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBareActDto } from './dto/create-bare-act.dto';
import { UpdateBareActDto } from './dto/update-bare-act.dto';
import { QueryBareActDto } from './dto/query-bare-act.dto';
import { Prisma } from '@prisma/client';
import { FILE_UPLOAD_QUEUES, FILE_UPLOAD_JOBS } from '../file-upload/constants/file-upload.constants';
import * as fs from 'fs';
import * as path from 'path';
import { QueueDispatcherService } from 'src/common/queue/queue-dispatcher.service';
import appConfig from 'src/config/app.config';

@Injectable()
export class BareActService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueDispatcher: QueueDispatcherService
  ) { }

  // -------------------------------------------------------------
  // ADMIN: Create Bare Act
  // -------------------------------------------------------------
  async create(dto: CreateBareActDto) {
    const bareAct = await this.prisma.bareAct.create({
      data: dto,
    });

    // Mark PDF file as ATTACHED via background worker if uploaded
    if (dto.pdf_path) {
      await this.queueDispatcher.enqueueFileAttachment(FILE_UPLOAD_JOBS.MARK_ATTACHED, {
        urls: [dto.pdf_path],
      });
    }

    return bareAct;
  }

  // -------------------------------------------------------------
  // PUBLIC / USER: List Bare Acts (Filters, Search, Pagination)
  // -------------------------------------------------------------
  async findAll(query: QueryBareActDto, isAdmin = false) {
    const { page = 1, limit = 10, search, category, source_type, is_active, sort_by, sort_order } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BareActWhereInput = {
      deleted_at: null, // Exclude soft-deleted records
    };

    // Public users can ONLY see active items
    if (!isAdmin) {
      where.is_active = true;
    } else if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (source_type) {
      where.source_type = source_type;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content_plain: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.bareAct.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort_by]: sort_order },
        select: {
          id: true,
          title: true,
          content_plain: true,
          content_html: true,
          category: true,
          source_type: true,
          pdf_path: true,
          is_active: true,
          allow_download: true,
          created_at: true,
          updated_at: true,
        },
      }),
      this.prisma.bareAct.count({ where }),
    ]);

    if (!isAdmin) {
      data.forEach((item) => {
        if (!isAdmin && !item.allow_download) {
          item.pdf_path = null;
        }
      });
    }

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
  // GET ONE BY ID
  // -------------------------------------------------------------
  async findOne(id: string, isAdmin = false) {
    const bareAct = await this.prisma.bareAct.findFirst({
      where: { id, deleted_at: null },
      select: {
        id: true,
        title: true,
        content_plain: true,
        content_html: true,
        category: true,
        source_type: true,
        is_active: true,
        allow_download: true,
        pdf_path: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!bareAct) {
      throw new NotFoundException(`Bare Act with ID '${id}' not found`);
    }

    if (!isAdmin && !bareAct.is_active) {
      throw new NotFoundException(`Bare Act with ID '${id}' not found`);
    }

    if (!isAdmin && !bareAct.allow_download) {
      bareAct.pdf_path = null;
    }

    return bareAct;
  }

  // -------------------------------------------------------------
  // ADMIN: Update
  // -------------------------------------------------------------
  async update(id: string, dto: UpdateBareActDto) {
    const existing = await this.findOne(id, true);

    const updated = await this.prisma.bareAct.update({
      where: { id: existing.id },
      data: {
        ...dto,
        updated_at: new Date(),
      },
    });

    // Mark newly linked PDF as ATTACHED
    if (dto.pdf_path && dto.pdf_path !== existing.pdf_path) {
      await this.queueDispatcher.enqueueFileAttachment(FILE_UPLOAD_JOBS.MARK_DETACHED, {
        urls: [existing.pdf_path],
      });

      await this.queueDispatcher.enqueueFileAttachment(FILE_UPLOAD_JOBS.MARK_ATTACHED, {
        urls: [dto.pdf_path],
      });
    }

    return updated;
  }

  // -------------------------------------------------------------
  // ADMIN: Soft Delete
  // -------------------------------------------------------------
  async remove(id: string) {
    const existing = await this.findOne(id, true);

    // Mark PDF file as DETACHED
    await this.queueDispatcher.enqueueFileAttachment(FILE_UPLOAD_JOBS.MARK_DETACHED, {
      urls: [existing.pdf_path],
    });

    return this.prisma.bareAct.delete({
      where: { id },
    });
  }

  // -------------------------------------------------------------
  // USER: Download PDF File Stream
  // -------------------------------------------------------------
  async getDownloadStream(id: string) {
    const bareAct = await this.findOne(id, false);

    if (!bareAct.allow_download) {
      throw new ForbiddenException('Download option is disabled for this Bare Act');
    }

    if (!bareAct.pdf_path) {
      throw new BadRequestException('No PDF document associated with this Bare Act');
    }

    const absolutePath = path.join(appConfig().storageUrl.rootUrl, bareAct.pdf_path);

    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundException('Physical PDF document file not found on server');
    }

    let contentType = 'application/pdf';
    if (path.extname(bareAct.pdf_path) === '.docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    return {
      stream: fs.createReadStream(absolutePath),
      filename: `${bareAct.title.replace(/[^a-zA-Z0-9]/g, '_')}${path.extname(bareAct.pdf_path)}`,
      type: contentType,
    };
  }

  async getUniqueCategories(): Promise<string[]> {
    const categories = await this.prisma.bareAct.findMany({
      where: {
        deleted_at: null,
        category: {
          not: null, // Exclude acts with no category set
        },
      },
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    // Extract string values from array of objects: [{ category: 'Civil' }] -> ['Civil']
    return categories
      .map((item) => item.category)
      .filter((category): category is string => Boolean(category));
  }
}