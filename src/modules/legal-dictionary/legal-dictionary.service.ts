import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLegalDictionaryDto } from './dto/create-legal-dictionary.dto';
import { UpdateLegalDictionaryDto } from './dto/update-legal-dictionary.dto';
import { FilterLegalDictionaryDto } from './dto/filter-legal-dictionary.dto';

@Injectable()
export class LegalDictionaryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLegalDictionaryDto) {
    return this.prisma.legalDictionary.create({
      data: dto,
    });
  }

  async findAll(filters: FilterLegalDictionaryDto) {
    const { search, startsWith, category, sortBy = 'term_en', sortOrder = 'asc', page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      deleted_at: null,
      ...(category && { category }),
      ...(startsWith && {
        OR: [
          { term_en: { startsWith, mode: 'insensitive' } },
          { term_bn: { startsWith, mode: 'insensitive' } },
        ],
      }),
      ...(search && {
        OR: [
          { term_en: { contains: search, mode: 'insensitive' } },
          { term_bn: { contains: search, mode: 'insensitive' } },
          { definition_en: { contains: search, mode: 'insensitive' } },
          { definition_bn: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.legalDictionary.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.legalDictionary.count({ where }),
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
    const term = await this.prisma.legalDictionary.findUnique({
      where: { id },
    });

    if (!term || term.deleted_at) {
      throw new NotFoundException(`Legal dictionary entry with ID ${id} not found`);
    }

    return term;
  }

  async update(id: string, dto: UpdateLegalDictionaryDto) {
    await this.findOne(id);
    return this.prisma.legalDictionary.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId?: string) {
    await this.findOne(id);
    return this.prisma.legalDictionary.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }
}