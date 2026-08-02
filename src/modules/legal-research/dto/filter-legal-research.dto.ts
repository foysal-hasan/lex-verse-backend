import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum LegalResearchSortBy {
  createdAt = 'created_at',
  title = 'title',
  author = 'author',
}

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export class FilterLegalResearchDto {
  @ApiPropertyOptional({ example: 'Judicial Review' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'Constitution', description: 'Filter by specific tag' })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({ enum: LegalResearchSortBy, default: LegalResearchSortBy.createdAt })
  @IsEnum(LegalResearchSortBy)
  @IsOptional()
  sortBy?: LegalResearchSortBy = LegalResearchSortBy.createdAt;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.desc })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.desc;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;
}