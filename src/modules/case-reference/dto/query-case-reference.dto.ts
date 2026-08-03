import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum CaseReferenceSortBy {
  CREATED_AT = 'created_at',
  PUBLISHED_AT = 'published_at',
  YEAR = 'year',
  CASE_TITLE = 'case_title',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryCaseReferenceDto {
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

  @ApiPropertyOptional({ description: 'Search title, citation, court, or plain content' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by court' })
  @IsString()
  @IsOptional()
  court?: string;

  @ApiPropertyOptional({ description: 'Filter by year' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({ description: 'Filter by tag' })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({ description: 'Filter published status (Admin only default: all)' })
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @ApiPropertyOptional({ enum: CaseReferenceSortBy, default: CaseReferenceSortBy.PUBLISHED_AT })
  @IsEnum(CaseReferenceSortBy)
  @IsOptional()
  sort_by?: CaseReferenceSortBy = CaseReferenceSortBy.PUBLISHED_AT;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsEnum(SortOrder)
  @IsOptional()
  sort_order?: SortOrder = SortOrder.DESC;
}