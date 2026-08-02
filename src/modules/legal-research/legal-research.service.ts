import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLegalResearchDto } from './dto/create-legal-research.dto';
import { UpdateLegalResearchDto } from './dto/update-legal-research.dto';
import { FilterLegalResearchDto } from './dto/filter-legal-research.dto';

@Injectable()
export class LegalResearchService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLegalResearchDto) {
    return this.prisma.legalResearch.create({
      data: dto,
    });
  }

  async findAll(filters: FilterLegalResearchDto) {
    const { search, tag, sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      deleted_at: null,
      ...(tag && { tags: { has: tag } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
          { abstract: { contains: search, mode: 'insensitive' } },
          { body_md: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.legalResearch.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.legalResearch.count({ where }),
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
    const research = await this.prisma.legalResearch.findUnique({
      where: { id },
    });

    if (!research || research.deleted_at) {
      throw new NotFoundException(`Legal research entry with ID ${id} not found`);
    }

    return research;
  }

  async update(id: string, dto: UpdateLegalResearchDto) {
    await this.findOne(id);
    return this.prisma.legalResearch.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId?: string) {
    await this.findOne(id);
    return this.prisma.legalResearch.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }
}