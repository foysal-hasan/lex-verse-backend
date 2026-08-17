import { Injectable, NotFoundException } from '@nestjs/common';
import { PkgProgram, PkgTrack } from 'src/generated/prisma/enums';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionSetDto } from './dto/create-question-set.dto';
import { AdminGetQuestionSetsQueryDto } from './dto/admin-get-question-sets-query.dto';
import { UpdateQuestionSetDto } from './dto/update-question-set.dto';




@Injectable()
export class QuestionSetService {
  constructor(private prisma: PrismaService) { }

  async createWithQuestions(dto: CreateQuestionSetDto) {
    const { question_ids, questions, ...setData } = dto;

    return await this.prisma.questionSet.create({
      data: {
        ...setData,
        written_exam_questions: {
          // Connect existing question IDs if provided
          ...(question_ids && question_ids.length > 0
            ? { connect: question_ids.map((id) => ({ id })) }
            : {}),

          // Create new questions inline if provided
          ...(questions && questions.length > 0
            ? {
              create: questions.map((q) => ({
                question_text: q.question_text,
                question_file_path: q.question_file_path,
                question_file_mime_type: q.question_file_mime_type,
                marks: q.marks ? new Decimal(q.marks) : new Decimal(10),
                guidelines: q.guidelines,
              })),
            }
            : {}),
        },
      },
      include: {
        written_exam_questions: true,
      },
    });
  }

  async findAll(query: AdminGetQuestionSetsQueryDto) {
    const { page = 1, limit = 10, search, program, track } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by program if provided
    if (program) {
      where.program = program;
    }

    // Filter by track if provided
    if (track) {
      where.track = track;
    }

    // Search filter across title or description case-insensitively
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute records fetch and total count concurrently
    const [items, total] = await Promise.all([
      this.prisma.questionSet.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.questionSet.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const questionSet = await this.prisma.questionSet.findUnique({
      where: { id },
      include: {
        written_exam_questions: true,
        written_exams: true,
      },
    });

    if (!questionSet) {
      throw new NotFoundException('Question Set not found');
    }
    return questionSet;
  }

  async update(id: string, dto: UpdateQuestionSetDto) {
    // Ensure the question set exists
    await this.findOne(id);

    const { questions, ...setData } = dto;

    const questionUpdates: any = {};

    // If new inline questions are passed during update, create and append them
    if (questions && questions.length > 0) {
      questionUpdates.written_exam_questions = {
        create: questions.map((q) => ({
          question_text: q.question_text,
          question_file_path: q.question_file_path,
          question_file_mime_type: q.question_file_mime_type,
          marks: q.marks ? new Decimal(q.marks) : new Decimal(10),
          guidelines: q.guidelines,
        })),
      };
    }

    return await this.prisma.questionSet.update({
      where: { id },
      data: {
        ...setData,
        ...questionUpdates,
      },
      include: {
        written_exam_questions: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.questionSet.delete({
      where: { id },
    });

    return { id }
  }


  async attachQuestions(id: string, questionIds: string[]) {
    await this.findOne(id);

    return await this.prisma.questionSet.update({
      where: { id },
      data: {
        written_exam_questions: {
          connect: questionIds.map((qid) => ({ id: qid })),
        },
      },
      include: {
        written_exam_questions: true,
      },
    });
  }

  async detachQuestions(id: string, questionIds: string[]) {
    await this.findOne(id);

    return await this.prisma.questionSet.update({
      where: { id },
      data: {
        written_exam_questions: {
          disconnect: questionIds.map((qid) => ({ id: qid })),
        },
      },
      include: {
        written_exam_questions: true,
      },
    });
  }
}