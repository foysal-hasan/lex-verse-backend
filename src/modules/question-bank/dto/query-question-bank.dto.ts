import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum AccessFilter {
  ALL = 'all',
  FREE = 'free',
  LOCKED = 'locked',
  APPROVED = 'approved',
}

export enum SortOption {
  FEATURED = 'featured',
  LATEST = 'latest',
  OLDEST = 'oldest',
  YEAR_DESC = 'year_desc',
  YEAR_ASC = 'year_asc',
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

  @ApiPropertyOptional({ enum: AccessFilter, default: AccessFilter.ALL })
  @IsEnum(AccessFilter)
  @IsOptional()
  access?: AccessFilter = AccessFilter.ALL;

  @ApiPropertyOptional({ enum: SortOption, default: SortOption.FEATURED })
  @IsEnum(SortOption)
  @IsOptional()
  sort?: SortOption = SortOption.FEATURED;

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
}