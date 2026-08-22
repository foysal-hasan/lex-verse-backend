import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { FilterPackageDto } from './dto/filter-package.dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class PackageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPackageDto: CreatePackageDto) {
    return this.prisma.package.create({
      data: createPackageDto,
    });
  }

  async findAllActive(filters: FilterPackageDto) {
    const { 
      program, 
      track, 
      kind, 
      search, 
      sortBy = 'sort_order', 
      sortOrder = 'asc', 
      page = 1, 
      limit = 10 
    } = filters;
    
    const skip = (page - 1) * limit;

    const where: Prisma.PackageWhereInput = {
      is_active: true,
      ...(program && { program }),
      ...(track && { track }),
      ...(kind && { kind }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { subtitle: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.package.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.package.count({ where }),
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

  async findAllAdmin(filters: FilterPackageDto) {
    const { 
      program, 
      track, 
      kind, 
      search, 
      is_active, 
      sortBy = 'created_at', 
      sortOrder = 'desc', 
      page = 1, 
      limit = 10 
    } = filters;
    
    const skip = (page - 1) * limit;

    const where: Prisma.PackageWhereInput = {
      ...(program && { program }),
      ...(track && { track }),
      ...(kind && { kind }),
      ...(is_active !== undefined && { is_active }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { subtitle: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.package.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.package.count({ where }),
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

  async findOne(id: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { id },
    });

    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    return pkg;
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    await this.findOne(id);
    return this.prisma.package.update({
      where: { id },
      data: updatePackageDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.package.delete({
      where: { id },
    });
  }
}