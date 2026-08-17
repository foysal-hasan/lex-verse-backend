import { Injectable, NotFoundException } from '@nestjs/common';
import { Storage } from 'src/common/lib/Disk/Storage';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { BulkUploadQuestionsDto } from './dto/bulk-upload-questions.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AdminGetQuestionsQueryDto } from './dto/admin-get-questions-query.dto';


@Injectable()
export class WrittenExamQuestionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuestionDto) {
    return await this.prisma.writtenExamQuestion.create({
      data: {
        ...dto,
        marks: dto.marks ? new Decimal(dto.marks) : undefined,
      },
    });
  }

  async bulkUpload(dto: BulkUploadQuestionsDto) {
    const formattedData = dto.questions.map((q) => ({
      question_text: q.question_text,
      question_file_path: q.question_file_path,
      question_file_mime_type: q.question_file_mime_type,
      marks: q.marks ? new Decimal(q.marks) : new Decimal(10),
      guidelines: q.guidelines,
    }));

    return await this.prisma.writtenExamQuestion.createMany({
      data: formattedData,
      skipDuplicates: true,
    });
  }

 async findAll(query: AdminGetQuestionsQueryDto) {
  const { page = 1, limit = 10, search } = query;
  const skip = (page - 1) * limit;

  const where: any = {
    deleted_at: null,
  };

  // Add search filter (searches question text or guidelines case-insensitively)
  if (search) {
    where.OR = [
      { question_text: { contains: search, mode: 'insensitive' } },
      { guidelines: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Execute queries in parallel
  const [items, total] = await Promise.all([
    this.prisma.writtenExamQuestion.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    this.prisma.writtenExamQuestion.count({ where }),
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
    const question = await this.prisma.writtenExamQuestion.findFirst({
      where: { id, deleted_at: null },
    });
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async update(id: string, dto: UpdateQuestionDto) {
    await this.findOne(id);
    return await this.prisma.writtenExamQuestion.update({
      where: { id },
      data: {
        ...dto,
        marks: dto.marks ? new Decimal(dto.marks) : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    const question = await this.prisma.writtenExamQuestion.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });

    if(!question?.question_file_path){
        await Storage.delete(question.question_file_path);
    }
    return { id};
  }
}