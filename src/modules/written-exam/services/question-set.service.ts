import { Injectable, NotFoundException } from '@nestjs/common';
import { PkgProgram, PkgTrack } from 'src/generated/prisma/enums';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';




@Injectable()
export class QuestionSetService {
  constructor(private prisma: PrismaService) {}

  async createWithQuestions(dto: {
    title: string;
    program: PkgProgram;
    track: PkgTrack;
    description?: string;
    questions: Array<{
      question_text: string;
      question_file_path?: string;
      question_file_mime_type?: string;
      marks?: number;
      guidelines?: string;
    }>;
  }) {
    const { questions, ...setData } = dto;

    return await this.prisma.questionSet.create({
      data: {
        ...setData,
        written_exam_questions: {
          create: questions.map((q) => ({
            question_text: q.question_text,
            question_file_path: q.question_file_path,
            question_file_mime_type: q.question_file_mime_type,
            marks: q.marks ? new Decimal(q.marks) : new Decimal(10),
            guidelines: q.guidelines,
          })),
        },
      },
      include: {
        written_exam_questions: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.questionSet.findMany({
      include: {
        written_exam_questions: true,
      },
    });
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

  async update(id: string, dto: any) {
    await this.findOne(id);
    return await this.prisma.questionSet.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.questionSet.delete({
      where: { id },
    });
  }
}