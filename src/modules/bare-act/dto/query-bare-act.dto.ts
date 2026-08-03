import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum BareActSortBy {
  CREATED_AT = 'created_at',
  TITLE = 'title',
  CATEGORY = 'category',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryBareActDto {
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

  @ApiPropertyOptional({ description: 'Search title and plain text content' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by source type (text/pdf/both)' })
  @IsString()
  @IsOptional()
  source_type?: string;

  @ApiPropertyOptional({ description: 'Filter active status (Admin only default: all)' })
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ enum: BareActSortBy, default: BareActSortBy.CREATED_AT })
  @IsEnum(BareActSortBy)
  @IsOptional()
  sort_by?: BareActSortBy = BareActSortBy.CREATED_AT;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsEnum(SortOrder)
  @IsOptional()
  sort_order?: SortOrder = SortOrder.DESC;
}