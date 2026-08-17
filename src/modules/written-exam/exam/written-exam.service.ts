import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PkgProgram } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWrittenExamDto } from './dto/written-exam.dto';

@Injectable()
export class WrittenExamService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWrittenExamDto) {
    const { packages, ...examData } = dto;

    return await this.prisma.writtenExam.create({
      data: {
        ...examData,
        package_written_exams: {
          create: packages.map((pkg) => ({
            package_id: pkg.package_id,
            title: pkg.title,
            routine_id: pkg.routine_id,
            start_datetime: pkg.start_datetime,
            end_datetime: pkg.end_datetime,
          })),
        },
      },
      include: {
        package_written_exams: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.writtenExam.findMany({
      where: { deleted_at: null },
      include: { package_written_exams: true },
    });
  }

  async findOne(id: string) {
    const exam = await this.prisma.writtenExam.findFirst({
      where: { id, deleted_at: null },
      include: {
        package_written_exams: true,
        question_sets: {
          include: { written_exam_questions: true },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Written exam not found');
    }
    return exam;
  }

  async update(id: string, dto: any) {
    await this.findOne(id); // Ensure existence
    return await this.prisma.writtenExam.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    return await this.prisma.writtenExam.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }
}