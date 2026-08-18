import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PkgProgram } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWrittenExamDto, UpdateWrittenExamDto } from './dto/create-written-exam.dto';
import { AdminGetWrittenExamsQueryDto } from './dto/admin-get-written-exams-query.dto';
import { AttachPackagesDto } from './dto/attach-packages.dto';
import { Storage } from 'src/common/lib/Disk/Storage';

@Injectable()
export class WrittenExamService {
  constructor(private prisma: PrismaService) { }

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

  async findAll(query: AdminGetWrittenExamsQueryDto) {
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
      where.package_written_exams = {
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
      this.prisma.writtenExam.findMany({
        where,
        skip,
        take: limit,
        include: {
          package_written_exams: true,
          question_sets: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.writtenExam.count({ where }),
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

  async update(id: string, dto: UpdateWrittenExamDto) {
    await this.findOne(id); // Ensure existence
    const { packages, ...rest } = dto
    return await this.prisma.writtenExam.update({
      where: { id },
      data: rest,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    const we = await this.prisma.writtenExam.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });

    if (we.question_file_path) {
      await Storage.delete(we.question_file_path)
    }

    return { id }
  }

  async attachPackages(examId: string, dto: AttachPackagesDto) {
    await this.findOne(examId);

    const data = dto.packages.map((pkg) => ({
      written_exam_id: examId,
      package_id: pkg.package_id,
      title: pkg.title,
      routine_id: pkg.routine_id,
      start_datetime: new Date(pkg.start_datetime),
      end_datetime: new Date(pkg.end_datetime),
    }));

    return await this.prisma.packageWrittenExam.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async detachPackages(examId: string, packageIds: string[]) {
    await this.findOne(examId);

    return await this.prisma.packageWrittenExam.deleteMany({
      where: {
        written_exam_id: examId,
        package_id: { in: packageIds },
      },
    });
  }
}