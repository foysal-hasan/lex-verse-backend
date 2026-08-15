import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { QueryRoutineAdminDto } from './dto/query-routine-admin.dto';
import { QueryRoutineUserDto } from './dto/query-routine-user.dto';
import { Storage } from 'src/common/lib/Disk/Storage';
import { PkgProgram } from 'src/generated/prisma/enums';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class RoutineService {
  constructor(private readonly prisma: PrismaService) { }

  // ================= ADMIN METHODS =================
  async create(dto: CreateRoutineDto) {
    return this.prisma.routine.create({
      data: dto,
      include: { package: { select: { id: true, title: true } } },
    });
  }

  async findAllAdmin(query: QueryRoutineAdminDto) {
    const { page = 1, limit = 10, search, program_type, track, routine_type, status, package_id } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.RoutineWhereInput = {};
    if (program_type) where.program_type = program_type;
    if (track) where.track = track;
    if (routine_type) where.routine_type = routine_type;

    if (package_id === 'none') {
      where.package_id = null;
    } else if (package_id) {
      where.package_id = package_id;
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (status === 'archived') {
      // Past exam dates (before today)
      where.exam_date = { lt: startOfToday };
    } else if (status === 'upcoming') {
      // Future exam dates (after today)
      where.exam_date = { gt: endOfToday };
    } else if (status === 'active') {
      // Active means happening today OR ongoing (no exam date set)
      where.OR = [
        { exam_date: { gte: startOfToday, lte: endOfToday } },
        { exam_date: null },
      ];
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.routine.findMany({
        where,
        skip,
        take: limit,
        orderBy: { exam_date: 'desc' },
        include: { package: { select: { id: true, title: true } } },
      }),
      this.prisma.routine.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async findOneAdmin(id: string) {
    const routine = await this.prisma.routine.findUnique({
      where: { id },
      include: { package: { select: { id: true, title: true } } },
    });
    if (!routine) throw new NotFoundException('Routine not found');
    return routine;
  }

  async update(id: string, dto: UpdateRoutineDto) {
    await this.findOneAdmin(id);
    return this.prisma.routine.update({
      where: { id },
      data: dto,
      include: { package: { select: { id: true, title: true } } },
    });
  }

  async remove(id: string) {
    await this.findOneAdmin(id);

    const routine = await this.prisma.routine.delete({
      where: { id }, select: {
        id: true,
        file_path: true,
      }
    });

    if (routine.file_path) {
      await Storage.delete(routine.file_path);
    }

    return routine;
  }

  // ================= USER METHODS =================
  private async verifyPackageAccess(userId: string, packageId: string) {
    const access = await this.prisma.userPackageAccess.findFirst({
      where: {
        user_id: userId,
        package_id: packageId,
        status: 'active',
        OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
      },
    });

    if (!access) {
      throw new ForbiddenException('Access denied. You do not have an active subscription to this package.');
    }
  }

  async getRoutineStats(userId: string, packageId: string, programType: PkgProgram) {
    await this.verifyPackageAccess(userId, packageId);

    const now = new Date();
    const routines = await this.prisma.routine.findMany({
      where: {
        is_published: true,
        program_type: programType,
        OR: [
          { package_id: packageId },
          { package_id: null },
        ],
      },
    });

    const total = routines.length;
    let done = 0;
    let remaining = 0;
    let nextExamDate: Date | null = null;

    for (const routine of routines) {
      if (routine.exam_date) {
        if (routine.exam_date < now) {
          done++;
        } else {
          remaining++;
          if (!nextExamDate || routine.exam_date < nextExamDate) {
            nextExamDate = routine.exam_date;
          }
        }
      } else {
        remaining++;
      }
    }

    return {
      total_routine: total,
      done,
      remaining,
      next_exam_date: nextExamDate,
    };
  }

  async findAllForUser(userId: string, query: QueryRoutineUserDto) {
    const { package_id, program_type, filter = 'all', page = 1, limit = 10, search } = query;
    await this.verifyPackageAccess(userId, package_id);

    const skip = (page - 1) * limit;
    const now = new Date();

    const where: Prisma.RoutineWhereInput = {
      is_published: true,
      program_type,
      OR: [
        { package_id },
        { package_id: null },
      ],
    };

    if (filter === 'done') {
      where.exam_date = { lt: now };
    } else if (filter === 'remain') {
      where.OR = [
        { exam_date: { gte: now } },
        { exam_date: null },
      ];
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.routine.findMany({
        where,
        skip,
        take: limit,
        orderBy: { exam_date: 'desc' },
        include: { package: { select: { id: true, title: true } } },
      }),
      this.prisma.routine.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async findOneForUser(id: string, userId: string) {
    const routine = await this.prisma.routine.findUnique({
      where: { id },
      include: { package: { select: { id: true, title: true } } },
    });

    if (!routine || !routine.is_published) {
      throw new NotFoundException('Routine not found');
    }

    if (routine.package_id) {
      await this.verifyPackageAccess(userId, routine.package_id);
    }

    return routine;
  }
}