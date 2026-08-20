import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AdminGetExamsQueryDto } from './dto/admin-get-exams-query.dto';
import { AttachPackagesDto } from './dto/attach-packages.dto';
import { Storage } from 'src/common/lib/Disk/Storage';
import { UpdatePackageExamDto } from './dto/update-package-exam.dto';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) { }

async create(dto: CreateExamDto) {
    const { packages, created_by, question_set_id, ...examData } = dto;

    if (packages && packages.length > 0) {
      const packageIds = packages.map((p) => p.package_id);
      const routineIds = packages.map((p) => p.routine_id);

      // Validate existence
      await this.validatePackagesExist(this.prisma, packageIds);
      await this.validateRoutinesExist(this.prisma, routineIds);
    }

    return await this.prisma.exam.create({
      data: {
        ...examData,
        ...(created_by ? { creator: { connect: { id: created_by } } } : {}),
        ...(question_set_id
          ? { question_sets: { connect: { id: question_set_id } } }
          : {}),
        package_exams:
          packages && packages.length > 0
            ? {
                create: packages.map((pkg) => ({
                  package: { connect: { id: pkg.package_id } },
                  title: pkg.title,
                  ...(pkg.routine_id ? { routine: { connect: { id: pkg.routine_id } } } : {}),
                  live_start_datetime: new Date(pkg.start_datetime),
                  live_end_datetime: new Date(pkg.end_datetime),
                })),
              }
            : undefined,
      },
      include: {
        package_exams: true,
        question_sets: true,
      },
    });
  }

  async findAll(query: AdminGetExamsQueryDto) {
    const { page = 1, limit = 10, search, program, package_id } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {
      deleted_at: null,
    };

    if (program) {
      where.program = program;
    }

    if (package_id) {
      where.package_exams = {
        some: {
          package_id: package_id,
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

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
        package_exams: {
          include: { package: true, routine: true },
        },
        question_sets: {
          include: {
            questions: {
              where: { deleted_at: null },
              include: { options: true },
            },
          },
        },
        creator: { select: { id: true, name: true } },
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
    return exam;
  }

  async update(id: string, dto: UpdateExamDto) {
    await this.findOne(id);
    return await this.prisma.exam.update({
      where: { id },
      data: dto,
      include: {
        package_exams: true,
        question_sets: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const exam = await this.findOne(id);

    const updatedExam = await this.prisma.exam.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });

    if (updatedExam.written_exam_question_file_path) {
      await Storage.delete(updatedExam.written_exam_question_file_path);
    }

    return { id };
  }

async attachPackages(examId: string, dto: AttachPackagesDto) {
    await this.findOne(examId);

    const packageIds = dto.packages.map((p) => p.package_id);
    const routineIds = dto.packages.map((p) => p.routine_id);

    // Validate existence before attaching
    await this.validatePackagesExist(this.prisma, packageIds);
    await this.validateRoutinesExist(this.prisma, routineIds);

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

  async updatePackageExam(examId: string, packageId: string, dto: UpdatePackageExamDto) {
    // Ensure the exam itself exists
    await this.findOne(examId);

    // If routine_id is being updated, validate it exists
    if (dto.routine_id) {
      const routine = await this.prisma.routine.findUnique({
        where: { id: dto.routine_id },
      });
      if (!routine) {
        throw new NotFoundException(`Routine not found with ID: ${dto.routine_id}`);
      }
    }

    // Map DTO to prisma update payload
    const updateData: any = {};
    if (dto.title) updateData.title = dto.title;
    if (dto.routine_id !== undefined) {
      updateData.routine = dto.routine_id ? { connect: { id: dto.routine_id } } : { disconnect: true };
    }
    if (dto.start_datetime) updateData.live_start_datetime = new Date(dto.start_datetime);
    if (dto.end_datetime) updateData.live_end_datetime = new Date(dto.end_datetime);

    try {
      return await this.prisma.packageExam.update({
        where: {
          package_id_exam_id: {
            package_id: packageId,
            exam_id: examId,
          },
        },
        data: updateData,
        include: { package: true, routine: true },
      });
    } catch (error) {
      throw new NotFoundException('Package exam link not found for this exam and package.');
    }
  }

  // Helper method to validate package existence
  async validatePackagesExist(prisma: PrismaService, packageIds: string[]) {
    if (!packageIds || packageIds.length === 0) return;

    const foundPackages = await prisma.package.findMany({
      where: { id: { in: packageIds } },
      select: { id: true },
    });

    if (foundPackages.length !== packageIds.length) {
      const foundIds = new Set(foundPackages.map((p) => p.id));
      const missingIds = packageIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(`Packages not found with IDs: ${missingIds.join(', ')}`);
    }
  }

  // Helper method to validate routine existence
  async validateRoutinesExist(prisma: PrismaService, routineIds: (string | undefined)[]) {
    const validRoutineIds = routineIds.filter((id): id is string => !!id);
    if (validRoutineIds.length === 0) return;

    const foundRoutines = await prisma.routine.findMany({
      where: { id: { in: validRoutineIds } },
      select: { id: true },
    });

    if (foundRoutines.length !== validRoutineIds.length) {
      const foundIds = new Set(foundRoutines.map((r) => r.id));
      const missingIds = validRoutineIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(`Routines not found with IDs: ${missingIds.join(', ')}`);
    }
  }
}