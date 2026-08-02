import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuizWithQuestionsDto } from './dto/create-quiz-with-questions.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { FilterQuizDto } from './dto/filter-quiz.dto';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  // Create Quiz with optional initial questions
  async create(dto: CreateQuizWithQuestionsDto, userId?: string) {
    const { questions, ...quizData } = dto;

    return this.prisma.quiz.create({
      data: {
        ...quizData,
        created_by: userId,
        questions: questions && questions.length > 0 ? {
          create: questions.map((q) => ({
            ...q,
            options: q.options ? q.options : undefined,
          })),
        } : undefined,
      },
      include: {
        questions: true,
      },
    });
  }

  // Find All Quizzes with Filter, Pagination, and Sorting
  async findAll(filters: FilterQuizDto) {
    const { search, exam_type, status, is_live, sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      deleted_at: null,
      ...(exam_type && { exam_type }),
      ...(status && { status }),
      ...(is_live !== undefined && { is_live }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.quiz.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: { select: { questions: true } },
        },
      }),
      this.prisma.quiz.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Find One Quiz by ID including Questions
  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  // Update Quiz Details
  async update(id: string, dto: UpdateQuizDto) {
    await this.findOne(id);
    const { questions, ...quizData } = dto;

    return this.prisma.quiz.update({
      where: { id },
      data: quizData,
      include: { questions: true },
    });
  }

  // Soft Delete Quiz
  async remove(id: string, userId?: string) {
    await this.findOne(id);
    return this.prisma.quiz.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }

  // Add a Single Question to an Existing Quiz (handles images)
  async addQuestion(quizId: string, dto: CreateQuestionDto) {
    await this.findOne(quizId); // Verify quiz existence

    return this.prisma.question.create({
      data: {
        ...dto,
        quiz_id: quizId,
        options: dto.options ? dto.options : undefined,
      },
    });
  }

  // Remove / Soft Delete a Question from a Quiz
  async removeQuestion(questionId: string, userId?: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }

    return this.prisma.question.update({
      where: { id: questionId },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }
}