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
import {
  QueryQuestionBankDto,
  AccessFilter,
  SortOption,
} from './dto/query-question-bank.dto';
import { Tier } from '@prisma/client';
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
  // HELPER: Check Access Rights
  // -------------------------------------------------------------
  async checkAccessPermission(questionBankId: string, userId?: string) {
    const qb = await this.prisma.questionBank.findFirst({
      where: { id: questionBankId, deleted_at: null },
    });

    if (!qb) {
      throw new NotFoundException('Question Bank not found');
    }

    if (qb.tier === Tier.free) {
      return { qb, hasAccess: true, reason: 'FREE_TIER' };
    }

    if (!userId) {
      return { qb, hasAccess: false, reason: 'UNAUTHENTICATED' };
    }

    // Direct Purchase Check
    const directPurchase = await this.prisma.questionBankPurchase.findFirst({
      where: {
        user_id: userId,
        question_bank_id: questionBankId,
        status: 'approved',
      },
    });

    // Package Access Request Check
    const packageAccessRequest = await this.prisma.packageAccessRequest.findFirst({
      where: {
        user_id: userId,
        package_id: qb.package_id,
        status: 'approved',
      },
    });

    if (packageAccessRequest) {
      return { qb, hasAccess: true, reason: 'PACKAGE_ACCESS_REQUEST' };
    }

    if (directPurchase) {
      return { qb, hasAccess: true, reason: 'DIRECT_PURCHASE' };
    }

    // Package Purchase Check
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
  // ADMIN: Create
  // -------------------------------------------------------------
  async create(dto: CreateQuestionBankDto) {
    const item = await this.prisma.questionBank.create({ data: dto });
    await this.enqueueAttachedFiles(dto);
    return item;
  }

  // -------------------------------------------------------------
  // LISTING: List Question Banks
  // -------------------------------------------------------------
  async findAll(query: QueryQuestionBankDto, userId?: string, isAdmin = false) {
    const {
      page = 1,
      limit = 10,
      search,
      access = AccessFilter.ALL,
      sort = SortOption.FEATURED,
      program_type,
      exam_type,
      content_type,
      subject,
      year,
      package_id,
      is_featured,
      is_published,
    } = query;

    const skip = (page - 1) * limit;

    // Dynamic Filter Object
    const where: Record<string, any> = { deleted_at: null };

    // Published Status Handling
    if (!isAdmin) {
      where.is_published = true;
    } else if (is_published !== undefined) {
      where.is_published = is_published;
    }

    // Featured Status Handling
    if (is_featured !== undefined) {
      where.is_featured = is_featured;
    }

    if (program_type) where.program_type = { equals: program_type, mode: 'insensitive' };
    if (exam_type) where.exam_type = { equals: exam_type, mode: 'insensitive' };
    if (content_type) where.content_type = { equals: content_type, mode: 'insensitive' };
    if (subject) where.subject = { equals: subject, mode: 'insensitive' };
    if (year) where.year = year;
    if (package_id) where.package_id = package_id;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Handle "Free" tier filter directly
    if (access === AccessFilter.FREE) {
      where.tier = Tier.free;
    }

    // Fetch User Approved Purchases (Direct + Package)
    let approvedQbIds: string[] = [];
    if (userId) {
      const [directPurchases, packagePurchases] = await Promise.all([
        this.prisma.questionBankPurchase.findMany({
          where: { user_id: userId, status: 'approved' },
          select: { question_bank_id: true },
        }),
        this.prisma.packageAccessRequest.findMany({
          where: { user_id: userId, status: 'approved' },
          select: { package_id: true },
        }),
      ]);

      const directQbIds = directPurchases.map((p) => p.question_bank_id);
      const userPackageIds = packagePurchases.map((p) => p.package_id);

      if (userPackageIds.length > 0) {
        const packageQbs = await this.prisma.questionBank.findMany({
          where: { package_id: { in: userPackageIds }, deleted_at: null },
          select: { id: true },
        });
        approvedQbIds = Array.from(
          new Set([...directQbIds, ...packageQbs.map((q) => q.id)]),
        );
      } else {
        approvedQbIds = directQbIds;
      }
    }

    // Handle Access Filter (`approved` vs `locked`)
    if (access === AccessFilter.APPROVED) {
      if (!userId || approvedQbIds.length === 0) {
        return { data: [], meta: { total: 0, page, limit, total_pages: 0 } };
      }
      where.id = { in: approvedQbIds };
    } else if (access === AccessFilter.LOCKED) {
      where.tier = Tier.premium;
      if (approvedQbIds.length > 0) {
        where.id = { notIn: approvedQbIds };
      }
    }

    // Sorting Logic
    let orderBy: Record<string, any>[] = [];
    switch (sort) {
      case SortOption.FEATURED:
        orderBy = [{ is_featured: 'desc' }, { created_at: 'desc' }];
        break;
      case SortOption.LATEST:
        orderBy = [{ created_at: 'desc' }];
        break;
      case SortOption.OLDEST:
        orderBy = [{ created_at: 'asc' }];
        break;
      case SortOption.YEAR_DESC:
        orderBy = [{ year: 'desc' }, { created_at: 'desc' }];
        break;
      case SortOption.YEAR_ASC:
        orderBy = [{ year: 'asc' }, { created_at: 'desc' }];
        break;
      default:
        orderBy = [{ created_at: 'desc' }];
    }

    const [data, total] = await Promise.all([
      this.prisma.questionBank.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          package: { select: { id: true, title_bn: true, price_bdt: true } },
        },
      }),
      this.prisma.questionBank.count({ where }),
    ]);

    // Format output: Mask pdf_path and pdf_url if user does not have access
    const formattedData = data.map((item) => {
      const isApproved = approvedQbIds.includes(item.id);
      const isUnlocked = item.tier === Tier.free || isApproved || isAdmin;

      return {
        ...item,
        pdf_path: isUnlocked ? item.pdf_path : null,
        pdf_url: isUnlocked ? item.pdf_url : null,
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
  // GET ONE
  // -------------------------------------------------------------
  async findOne(id: string, userId?: string, isAdmin = false) {
    const qb = await this.prisma.questionBank.findFirst({
      where: { id, deleted_at: null },
      include: { package: { select: { id: true, title_bn: true, price_bdt: true } } },
    });

    if (!qb) {
      throw new NotFoundException(`Question Bank '${id}' not found`);
    }

    if (!isAdmin && !qb.is_published) {
      throw new NotFoundException(`Question Bank '${id}' not found`);
    }

    const { hasAccess, reason } = await this.checkAccessPermission(id, userId);
    const isUnlocked = hasAccess || isAdmin;

    return {
      ...qb,
      pdf_path: isUnlocked ? qb.pdf_path : null,
      pdf_url: isUnlocked ? qb.pdf_url : null,
      is_unlocked: isUnlocked,
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
  // DOWNLOAD STREAM
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
  // DISTINCT OPTIONS
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