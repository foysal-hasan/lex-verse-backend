import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { QueryRoutineAdminDto } from './dto/query-routine-admin.dto';
import { QueryRoutineUserDto } from './dto/query-routine-user.dto';
import { Storage } from 'src/common/lib/Disk/Storage';
import { PkgProgram } from 'src/generated/prisma/enums';
import { Prisma } from 'src/generated/prisma/client';
import { PinnedQueryRoutineUserDto } from './dto/pinned-query-routine-user.dto';

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
  async getRoutineStats(packageId: string, programType: PkgProgram) {
    const now = new Date();
    const baseWhere = {
      is_published: true,
      program_type: programType,
      OR: [
        { package_id: packageId },
        { package_id: null },
      ],
    };

    // Run all database queries concurrently in parallel
    const [total, done, nextRoutine] = await Promise.all([
      // 1. Get total count
      this.prisma.routine.count({ where: baseWhere }),

      // 2. Get count of routines whose exam date has passed (< now)
      this.prisma.routine.count({
        where: {
          ...baseWhere,
          exam_date: { lt: now },
        },
      }),

      // 3. Find the closest upcoming routine (>= now)
      this.prisma.routine.findFirst({
        where: {
          ...baseWhere,
          exam_date: { gte: now },
        },
        orderBy: { exam_date: 'asc' },
        select: { exam_date: true },
      }),
    ]);

    // Remaining is total minus the ones that are done
    const remaining = total - done;

    return {
      total_routine: total,
      done,
      remaining,
      next_exam_date: nextRoutine?.exam_date ?? null,
    };
  }

  async findAllForUser(query: QueryRoutineUserDto) {
    const { package_id, program_type, filter = 'all', page = 1, limit = 10, search } = query;

    if (!package_id) throw new BadRequestException('Package ID is required');
    if (!program_type) throw new BadRequestException('Program type is required');

    const skip = (page - 1) * limit;
    const now = new Date();

    const where: Prisma.RoutineWhereInput = {
      is_published: true,
      program_type,
      OR: [
        { package_id },
        { package_id: null, program_type: program_type, },
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
        select: {
          id: true,
          created_at: true,
          updated_at: true,
          program_type: true,
          track: true,
          routine_type: true,
          routine_number: true,
          exam_date: true,
          academic_year: true,
          session_label: true,
          title: true,
          description: true,
          file_mime_type: true,
          file_path: true,
          is_published: true,
          is_pinned: false,
          package_id: true,
          package: { select: { id: true, title: true } }
        }
      }),
      this.prisma.routine.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  // get pinned routines
  async findPinnedRoutinesForUser(query: PinnedQueryRoutineUserDto) {
    const { package_id, program_type, filter = 'all', search } = query;
    if (!package_id) throw new BadRequestException('Package ID is required');
    if (!program_type) throw new BadRequestException('Program type is required');

    const where: Prisma.RoutineWhereInput = {
      is_published: true,
      is_pinned: true,
      program_type,
      OR: [
        { package_id },
        { package_id: null, program_type: program_type, },
      ],
    };

    const now = new Date();

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

    const routines = await this.prisma.routine.findMany({
      where,
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        program_type: true,
        track: true,
        routine_type: true,
        routine_number: true,
        exam_date: true,
        academic_year: true,
        session_label: true,
        title: true,
        description: true,
        file_mime_type: true,
        file_path: true,
        is_published: true,
        is_pinned: false,
        package_id: true,
        package: { select: { id: true, title: true } }
      }
    });
    return routines;
  }

  async findOneForUser(id: string) {
    const routine = await this.prisma.routine.findUnique({
      where: { id },
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        program_type: true,
        track: true,
        routine_type: true,
        routine_number: true,
        exam_date: true,
        academic_year: true,
        session_label: true,
        title: true,
        description: true,
        file_mime_type: true,
        file_path: true,
        is_published: true,
        is_pinned: false,
        package_id: true,
        package: { select: { id: true, title: true } }
      }
    });

    if (!routine || !routine.is_published) {
      throw new NotFoundException('Routine not found');
    }
    return routine;
  }
}