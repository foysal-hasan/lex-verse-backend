import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionBankPurchaseDto } from './dto/create-question-bank-purchase.dto';
import { ReviewQuestionBankPurchaseDto, PurchaseStatus } from './dto/review-purchase.dto';
import { QueryQuestionBankPurchaseDto } from './dto/query-purchase.dto';
import { Tier } from 'src/generated/prisma/enums';

@Injectable()
export class QuestionBankPurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  // -------------------------------------------------------------
  // USER: Create Purchase Request
  // -------------------------------------------------------------
  async createPurchase(userId: string, dto: CreateQuestionBankPurchaseDto) {
    const qb = await this.prisma.questionBank.findFirst({
      where: { id: dto.question_bank_id, deleted_at: null },
    });

    if (!qb) {
      throw new NotFoundException('Question Bank not found');
    }

    if (qb.tier === Tier.free) {
      throw new BadRequestException('This Question Bank is free. Purchase is not required.');
    }

    // Check if purchase record already exists
    const existing = await this.prisma.questionBankPurchase.findFirst({
      where: {
          user_id: userId,
          question_bank_id: dto.question_bank_id,
          OR: [
            { status: PurchaseStatus.APPROVED },
            { status: PurchaseStatus.PENDING },
          ],
      },
    });

    if (existing) {
      if (existing.status === PurchaseStatus.APPROVED) {
        throw new ConflictException('You have already purchased this Question Bank');
      }
      if (existing.status === PurchaseStatus.PENDING) {
        throw new ConflictException('You already have a pending purchase request for this Question Bank');
      }
    }

    // Resolve Price (Use discount price if available)
    const finalPrice = qb.discount_price ? qb.discount_price : qb.price;

    return this.prisma.questionBankPurchase.create({
      data: {
        user_id: userId,
        question_bank_id: dto.question_bank_id,
        price: finalPrice,
        currency: 'BDT',
        payment_method: dto.payment_method,
        payment_reference: dto.payment_reference,
        status: PurchaseStatus.PENDING,
      },
      include: {
        question_bank: { select: { id: true, title: true } },
      },
    });
  }

  // -------------------------------------------------------------
  // LIST PURCHASES (User / Admin)
  // -------------------------------------------------------------
  async findAll(query: QueryQuestionBankPurchaseDto, userId?: string) {
    const { page = 1, limit = 10, status, user_id, search } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};

    // Filter by target user if user_id passed or scoped to current user
    if (userId) {
      where.user_id = userId;
    } else if (user_id) {
      where.user_id = user_id;
    }

    if (status) where.status = status;

    if (search) {
      where.OR = [
        { payment_reference: { contains: search, mode: 'insensitive' } },
        { admin_note: { contains: search, mode: 'insensitive' } },
        { question_bank: { title: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.questionBankPurchase.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          question_bank: {
            select: { id: true, title: true, tier: true, price: true, discount_price: true },
          },
        },
      }),
      this.prisma.questionBankPurchase.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // -------------------------------------------------------------
  // GET SINGLE PURCHASE BY ID
  // -------------------------------------------------------------
  async findOne(id: string, userId?: string) {
    const purchase = await this.prisma.questionBankPurchase.findUnique({
      where: { id },
      include: {
        question_bank: true,
      },
    });

    if (!purchase) {
      throw new NotFoundException(`Purchase record '${id}' not found`);
    }

    if (userId && purchase.user_id !== userId) {
      throw new NotFoundException(`Purchase record '${id}' not found`);
    }

    return purchase;
  }

  // -------------------------------------------------------------
  // ADMIN: Review (Approve / Reject) Purchase Request
  // -------------------------------------------------------------
  async reviewPurchase(
    id: string,
    dto: ReviewQuestionBankPurchaseDto,
    adminUserId: string,
  ) {
    const purchase = await this.findOne(id);

    return this.prisma.questionBankPurchase.update({
      where: { id },
      data: {
        status: dto.status,
        admin_note: dto.admin_note ?? purchase.admin_note,
        reviewed_by: adminUserId,
        reviewed_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        question_bank: { select: { id: true, title: true } },
      },
    });
  }
}