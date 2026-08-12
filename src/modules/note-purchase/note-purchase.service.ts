import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotePurchaseDto } from './dto/create-note-purchase.dto';
import { QueryNotePurchaseDto } from './dto/query-note-purchase.dto';
import { NotePurchaseStatus, NoteTier } from '@prisma/client';
import { UpdateNotePurchaseStatusDto } from './dto/update-note-purchase.dto';

@Injectable()
export class NotePurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  // USER: Request Note Purchase
  async create(userId: string, dto: CreateNotePurchaseDto) {
    const note = await this.prisma.note.findUnique({ where: { id: dto.note_id } });
    if (!note) throw new NotFoundException('Note not found');
    if (note.tier === NoteTier.free) throw new BadRequestException('Cannot purchase free notes.');

    const priceToPay = note.discount_price.gt(0) ? note.discount_price : note.price;

    return this.prisma.notePurchase.create({
      data: {
        user_id: userId,
        note_id: dto.note_id,
        amount: priceToPay,
        sender_phone: dto.sender_phone,
        transaction_id: dto.transaction_id,
        payment_method: dto.payment_method,
        status: NotePurchaseStatus.pending,
      },
    });
  }

// USER: List own requests with pagination, filter, and search
  async findAllForUser(userId: string, query: QueryNotePurchaseDto) {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = { user_id: userId };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { transaction_id: { contains: search, mode: 'insensitive' } },
        { note: { title: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.notePurchase.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          note: { select: { id: true, title: true, tier: true, price: true, discount_price: true } },
        },
      }),
      this.prisma.notePurchase.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  // ADMIN: List with filter, search, pagination
  async findAllAdmin(query: QueryNotePurchaseDto) {
    const { page = 1, limit = 10, status, user_id, search } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};
    if (status) where.status = status;
    if (user_id) where.user_id = user_id;
    if (search) {
      where.OR = [
        { transaction_id: { contains: search, mode: 'insensitive' } },
        { sender_phone: { contains: search, mode: 'insensitive' } },
        { note: { title: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.notePurchase.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          note: { select: { id: true, title: true } },
          user: { select: { id: true, email: true, name: true } },
        },
      }),
      this.prisma.notePurchase.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  // ADMIN: Take action (Approve/Reject pending requests or change statuses later)
  async updateStatus(id: string, adminId: string, dto: UpdateNotePurchaseStatusDto) {
    const purchase = await this.prisma.notePurchase.findUnique({ where: { id } });
    if (!purchase) throw new NotFoundException('Note purchase request not found');

    return this.prisma.notePurchase.update({
      where: { id },
      data: {
        status: dto.status,
        admin_note: dto.admin_note,
        reviewed_by: adminId,
        reviewed_at: new Date(),
      },
      include: { note: true, user: true },
    });
  }
}