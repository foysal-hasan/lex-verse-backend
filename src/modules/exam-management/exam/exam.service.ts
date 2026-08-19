import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PkgProgram } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AdminGetExamsQueryDto } from './dto/admin-get-exams-query.dto';
import { AttachPackagesDto } from './dto/attach-packages.dto';
import { Storage } from 'src/common/lib/Disk/Storage';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateExamDto) {
    const { packages, created_by, ...examData } = dto;

    const data: Prisma.ExamCreateInput = {
      ...examData,
      ...(created_by
        ? { creator: { connect: { id: created_by } } }
        : {}),
      package_exams: {
        create: packages.map((pkg) => ({
          package: { connect: { id: pkg.package_id } },
          title: pkg.title,
          ...(pkg.routine_id
            ? { routine: { connect: { id: pkg.routine_id } } }
            : {}),
          live_start_datetime: new Date(pkg.start_datetime),
          live_end_datetime: new Date(pkg.end_datetime),
        })),
      },
    };

    return await this.prisma.exam.create({
      data,
      include: {
        package_exams: true,
      },
    });
  }

  async findAll(query: AdminGetExamsQueryDto) {
    const { page = 1, limit = 10, search, program, package_id } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      deleted_at: null,
    };

    if (program) {
      where.program = program;
    }

    // Filter by package relationship if package_id is provided
    if (package_id) {
      where.package_exams = {
        some: {
          package_id: package_id,
        },
      };
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
      this.prisma.exam.findMany({
        where,
        skip,
        take: limit,
        include: {
          package_exams: true,
          question_sets: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.exam.count({ where }),
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
    const exam = await this.prisma.exam.findFirst({
      where: { id, deleted_at: null },
      include: {
        package_exams: true,
        question_sets: {
          include: { exam_questions: true },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
    return exam;
  }

  async update(id: string, dto: UpdateExamDto) {
    await this.findOne(id); // Ensure existence
    return await this.prisma.exam.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    const we = await this.prisma.exam.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });

    if (we.written_exam_question_file_path) {
      await Storage.delete(we.written_exam_question_file_path)
    }

    return { id }
  }

  async attachPackages(examId: string, dto: AttachPackagesDto) {
    await this.findOne(examId);

    const data = dto.packages.map((pkg) => ({
      exam_id: examId,
      package_id: pkg.package_id,
      title: pkg.title,
      routine_id: pkg.routine_id,
      live_start_datetime: new Date(pkg.start_datetime),
      live_end_datetime: new Date(pkg.end_datetime),
    }));

    return await this.prisma.packageExam.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async detachPackages(examId: string, packageIds: string[]) {
    await this.findOne(examId);

    return await this.prisma.packageExam.deleteMany({
      where: {
        exam_id: examId,
        package_id: { in: packageIds },
      },
    });
  }
}
