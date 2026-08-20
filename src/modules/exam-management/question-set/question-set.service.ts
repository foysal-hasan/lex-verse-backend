import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionSetDto } from './dto/create-question-set.dto';
import { UpdateQuestionSetDto } from './dto/update-question-set.dto';
import { AdminGetQuestionSetsQueryDto } from './dto/admin-get-question-sets-query.dto';

@Injectable()
export class QuestionSetService {
  constructor(private readonly prisma: PrismaService) { }

  async createWithQuestions(dto: CreateQuestionSetDto, userId?: string) {
    const { question_ids, new_questions, ...rest } = dto;

    const questionOperations: any = {};

    if (question_ids && question_ids.length > 0) {
      questionOperations.connect = question_ids.map((id) => ({ id }));
    }

    if (new_questions && new_questions.length > 0) {
      questionOperations.create = new_questions.map((q) => {
        const { options, ...qRest } = q;
        return {
          ...qRest,
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
        };
      });
    }

    return this.prisma.questionSet.create({
      data: {
        ...rest,
        questions: Object.keys(questionOperations).length > 0 ? questionOperations : undefined,
      },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });
  }

  async findAll(query: AdminGetQuestionSetsQueryDto) {
    const { page = 1, limit = 10, search, program, track } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};
    if (program) where.program = program;
    if (track) where.track = track;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.questionSet.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          _count: { select: { questions: true } },
        },
      }),
      this.prisma.questionSet.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const questionSet = await this.prisma.questionSet.findUnique({
      where: { id },
      include: {
        questions: {
          where: { deleted_at: null },
          include: { options: true },
        },
      },
    });

    if (!questionSet) {
      throw new NotFoundException('Question set not found');
    }

    return questionSet;
  }

  async update(id: string, dto: UpdateQuestionSetDto) {
    await this.findOne(id);

    return this.prisma.questionSet.update({
      where: { id },
      data: dto, // question_ids are omitted, updates only text fields
      include: {
        questions: {
          include: { options: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.questionSet.delete({ where: { id } });
    return { id };
  }

  async attachQuestions(id: string, questionIds: string[]) {
    await this.findOne(id);

    return this.prisma.questionSet.update({
      where: { id },
      data: {
        questions: {
          connect: questionIds.map((qId) => ({ id: qId })),
        },
      },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });
  }

  async detachQuestions(id: string, questionIds: string[]) {
    await this.findOne(id);

    return this.prisma.questionSet.update({
      where: { id },
      data: {
        questions: {
          disconnect: questionIds.map((qId) => ({ id: qId })),
        },
      },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });
  }
}