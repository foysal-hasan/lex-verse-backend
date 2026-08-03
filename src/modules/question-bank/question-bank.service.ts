import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueueDispatcherService } from 'src/common/queue/queue-dispatcher.service';
import { FILE_UPLOAD_JOBS } from '../file-upload/constants/file-upload.constants';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';
import { UpdateQuestionBankDto } from './dto/update-question-bank.dto';
import { QueryQuestionBankDto } from './dto/query-question-bank.dto';
import { Tier } from 'src/generated/prisma/enums';
import { Prisma } from "src/generated/prisma/client"

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class QuestionBankService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueDispatcher: QueueDispatcherService,
  ) {}

  // -------------------------------------------------------------
  // HELPER: Track Files for Background Queue Processing
  // -------------------------------------------------------------
  private async enqueueAttachedFiles(dto: Partial<CreateQuestionBankDto>) {
    const fileUrls: string[] = [];
    if (dto.pdf_path) fileUrls.push(dto.pdf_path);
    if (dto.pdf_url) fileUrls.push(dto.pdf_url);

    if (fileUrls.length > 0) {
      await this.queueDispatcher.enqueueFileAttachment(
        FILE_UPLOAD_JOBS.MARK_ATTACHED,
        { urls: fileUrls },
      );
    }
  }

  // -------------------------------------------------------------
  // HELPER: Check Download / Access Rights for a User
  // -------------------------------------------------------------
  async checkAccessPermission(questionBankId: string, userId?: string) {
    const qb = await this.prisma.questionBank.findFirst({
      where: { id: questionBankId, deleted_at: null },
    });

    if (!qb) {
      throw new NotFoundException('Question Bank not found');
    }

    // 1. Free tier is accessible to everyone
    if (qb.tier === Tier.free) {
      return { qb, hasAccess: true, reason: 'FREE_TIER' };
    }

    if (!userId) {
      return { qb, hasAccess: false, reason: 'UNAUTHENTICATED' };
    }

    // 2. Direct Approved Purchase Check
    const directPurchase = await this.prisma.questionBankPurchase.findFirst({
      where: {
        user_id: userId,
        question_bank_id: questionBankId,
        status: 'approved',
      },
    });

    if (directPurchase) {
      return { qb, hasAccess: true, reason: 'DIRECT_PURCHASE' };
    }

    // 3. Parent Package Purchase Check (if linked to a package)
    if (qb.package_id) {
      const packagePurchase = await this.prisma.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM package_purchases 
        WHERE user_id = ${userId} 
          AND package_id = ${qb.package_id} 
          AND status = 'approved' 
        LIMIT 1
      `;

      if (packagePurchase && packagePurchase.length > 0) {
        return { qb, hasAccess: true, reason: 'PACKAGE_PURCHASE' };
      }
    }

    return { qb, hasAccess: false, reason: 'PREMIUM_REQUIRED' };
  }

  // -------------------------------------------------------------
  // ADMIN: Create Question Bank
  // -------------------------------------------------------------
  async create(dto: CreateQuestionBankDto) {
    const item = await this.prisma.questionBank.create({
      data: dto,
    });

    await this.enqueueAttachedFiles(dto);
    return item;
  }

  // -------------------------------------------------------------
  // LISTING: List Question Banks with Access Status Mapping
  // -------------------------------------------------------------
  async findAll(query: QueryQuestionBankDto, userId?: string, isAdmin = false) {
    const {
      page = 1,
      limit = 10,
      search,
      tier,
      program_type,
      exam_type,
      content_type,
      subject,
      year,
      package_id,
      is_featured,
      is_published,
      sort_by,
      sort_order,
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.QuestionBankWhereInput = { deleted_at: null };

    if (!isAdmin) {
      where.is_published = true;
    } else if (is_published !== undefined) {
      where.is_published = is_published;
    }

    if (tier) where.tier = tier;
    if (program_type) where.program_type = { equals: program_type, mode: 'insensitive' };
    if (exam_type) where.exam_type = { equals: exam_type, mode: 'insensitive' };
    if (content_type) where.content_type = { equals: content_type, mode: 'insensitive' };
    if (subject) where.subject = { equals: subject, mode: 'insensitive' };
    if (year) where.year = year;
    if (package_id) where.package_id = package_id;
    if (is_featured !== undefined) where.is_featured = is_featured;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.questionBank.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort_by]: sort_order },
        include: {
          package: {
            select: { id: true, title_bn: true, price_bdt: true },
          },
          ...(userId
            ? {
                question_bank_purchases: {
                  where: { user_id: userId },
                  select: { status: true },
                },
              }
            : {}),
        },
      }),
      this.prisma.questionBank.count({ where }),
    ]);

    // Map output with dynamic `is_unlocked` state for the logged-in user
    const formattedData = data.map((item) => {
      const directPurchaseApproved =
        item.question_bank_purchases?.some((p) => p.status === 'approved') ?? false;

      const isUnlocked =
        item.tier === Tier.free || directPurchaseApproved || isAdmin;

      const { question_bank_purchases, ...rest } = item;
      return {
        ...rest,
        is_unlocked: isUnlocked,
      };
    });

    return {
      data: formattedData,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // -------------------------------------------------------------
  // GET SINGLE BY ID
  // -------------------------------------------------------------
  async findOne(id: string, userId?: string, isAdmin = false) {
    const qb = await this.prisma.questionBank.findFirst({
      where: { id, deleted_at: null },
      include: {
        package: { select: { id: true, title_bn: true, price_bdt: true } },
      },
    });

    if (!qb) {
      throw new NotFoundException(`Question Bank '${id}' not found`);
    }

    if (!isAdmin && !qb.is_published) {
      throw new NotFoundException(`Question Bank '${id}' not found`);
    }

    const { hasAccess, reason } = await this.checkAccessPermission(id, userId);

    return {
      ...qb,
      is_unlocked: hasAccess || isAdmin,
      access_reason: reason,
    };
  }

  // -------------------------------------------------------------
  // ADMIN: Update
  // -------------------------------------------------------------
  async update(id: string, dto: UpdateQuestionBankDto) {
    await this.findOne(id, undefined, true);

    const updated = await this.prisma.questionBank.update({
      where: { id },
      data: dto,
    });

    await this.enqueueAttachedFiles(dto);
    return updated;
  }

  // -------------------------------------------------------------
  // ADMIN: Soft Delete
  // -------------------------------------------------------------
  async remove(id: string, adminUserId: string) {
    await this.findOne(id, undefined, true);

    return this.prisma.questionBank.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: adminUserId,
        is_published: false,
      },
    });
  }

  // -------------------------------------------------------------
  // USER: Download File Stream (With Access Control & Counter)
  // -------------------------------------------------------------
  async getDownloadStream(id: string, userId: string) {
    const { qb, hasAccess } = await this.checkAccessPermission(id, userId);

    if (!hasAccess) {
      throw new ForbiddenException(
        'You must purchase this Question Bank or its package to download this document.',
      );
    }

    if (!qb.allow_download) {
      throw new ForbiddenException('Downloads are disabled for this Question Bank');
    }

    const filePath = qb.pdf_path || qb.pdf_url;
    if (!filePath) {
      throw new BadRequestException('No PDF document file configured for this entry');
    }

    const absolutePath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundException('Physical document file missing on server');
    }

    // Atomic update for download analytics
    await this.prisma.questionBank.update({
      where: { id },
      data: {
        download_count: { increment: 1 },
        last_downloaded_at: new Date(),
      },
    });

    const cleanFilename = qb.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');

    return {
      stream: fs.createReadStream(absolutePath),
      filename: `${cleanFilename}.pdf`,
      type: 'application/pdf',
    };
  }

  // -------------------------------------------------------------
  // DISTINCT FILTER OPTIONS
  // -------------------------------------------------------------
  async getUniqueProgramTypes(): Promise<string[]> {
    const res = await this.prisma.questionBank.findMany({
      where: { deleted_at: null },
      select: { program_type: true },
      distinct: ['program_type'],
      orderBy: { program_type: 'asc' },
    });
    return res.map((r) => r.program_type);
  }

  async getUniqueExamTypes(): Promise<string[]> {
    const res = await this.prisma.questionBank.findMany({
      where: { deleted_at: null },
      select: { exam_type: true },
      distinct: ['exam_type'],
      orderBy: { exam_type: 'asc' },
    });
    return res.map((r) => r.exam_type);
  }

  async getUniqueSubjects(): Promise<string[]> {
    const res = await this.prisma.questionBank.findMany({
      where: { deleted_at: null, subject: { not: null } },
      select: { subject: true },
      distinct: ['subject'],
      orderBy: { subject: 'asc' },
    });
    return res.map((r) => r.subject).filter((s): s is string => Boolean(s));
  }
}