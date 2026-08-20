import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AdminGetQuestionsQueryDto } from './dto/admin-get-questions-query.dto';
import { BulkUploadQuestionsDto } from './dto/bulk-upload-questions.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateQuestionDto, userId?: string) {
    const { options, ...rest } = dto;

    return this.prisma.question.create({
      data: {
        ...rest,
        created_by: userId,
        options:
          options && options.length > 0
            ? {
                create: options.map((opt) => ({
                  option_key: opt.option_key,
                  option_text: opt.option_text,
                })),
              }
            : undefined,
      },
      include: { options: true },
    });
  }

  async bulkUpload(dto: BulkUploadQuestionsDto, userId?: string) {
    const results = await Promise.all(
      dto.questions.map((qDto) => this.create(qDto, userId)),
    );
    return {
      count: results.length,
      items: results,
    };
  }

  async findAll(query: AdminGetQuestionsQueryDto) {
    const { page = 1, limit = 10, search, format } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = { deleted_at: null };
    if (format) where.format = format;
    if (search) {
      where.question_text = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { options: true },
      }),
      this.prisma.question.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findFirst({
      where: { id, deleted_at: null },
      include: { options: true },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async update(id: string, dto: UpdateQuestionDto) {
    await this.findOne(id); // Ensure question exists and is not deleted
    const { options, ...rest } = dto;

    // Use transaction to safely handle options synchronization
    return this.prisma.$transaction(async (prisma) => {
      if (options) {
        // Clear existing options and recreate new ones if options array is provided
        await prisma.option.deleteMany({ where: { question_id: id } });
      }

      return prisma.question.update({
        where: { id },
        data: {
          ...rest,
          options:
            options && options.length > 0
              ? {
                  create: options.map((opt) => ({
                    option_key: opt.option_key,
                    option_text: opt.option_text,
                  })),
                }
              : undefined,
        },
        include: { options: true },
      });
    });
  }

  async remove(id: string, userId?: string) {
    await this.findOne(id);

    await this.prisma.question.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
    return { id };
  }
}