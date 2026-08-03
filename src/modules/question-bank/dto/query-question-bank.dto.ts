import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Tier } from '@prisma/client';

export enum QuestionBankSortBy {
  CREATED_AT = 'created_at',
  YEAR = 'year',
  TITLE = 'title',
  DOWNLOAD_COUNT = 'download_count',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryQuestionBankDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search title, description, or subject' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: Tier })
  @IsEnum(Tier)
  @IsOptional()
  tier?: Tier;

  @ApiPropertyOptional({ description: 'Filter by program type' })
  @IsString()
  @IsOptional()
  program_type?: string;

  @ApiPropertyOptional({ description: 'Filter by exam type' })
  @IsString()
  @IsOptional()
  exam_type?: string;

  @ApiPropertyOptional({ description: 'Filter by content type' })
  @IsString()
  @IsOptional()
  content_type?: string;

  @ApiPropertyOptional({ description: 'Filter by subject' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiPropertyOptional({ description: 'Filter by year' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({ description: 'Filter by associated package ID' })
  @IsString()
  @IsOptional()
  package_id?: string;

  @ApiPropertyOptional({ description: 'Filter featured items' })
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  @IsOptional()
  is_featured?: boolean;

  @ApiPropertyOptional({ description: 'Filter published status (Admin only)' })
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @ApiPropertyOptional({ enum: QuestionBankSortBy, default: QuestionBankSortBy.CREATED_AT })
  @IsEnum(QuestionBankSortBy)
  @IsOptional()
  sort_by?: QuestionBankSortBy = QuestionBankSortBy.CREATED_AT;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsEnum(SortOrder)
  @IsOptional()
  sort_order?: SortOrder = SortOrder.DESC;
}