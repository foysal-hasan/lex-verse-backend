import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum QuizSortBy {
  createdAt = 'created_at',
  title = 'title',
  examDate = 'exam_date',
}

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export class FilterQuizDto {
  @ApiPropertyOptional({ example: 'BJS' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'preliminary' })
  @IsString()
  @IsOptional()
  exam_type?: string;

  @ApiPropertyOptional({ example: 'upcoming' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  is_live?: boolean;

  @ApiPropertyOptional({ enum: QuizSortBy, default: QuizSortBy.createdAt })
  @IsEnum(QuizSortBy)
  @IsOptional()
  sortBy?: QuizSortBy = QuizSortBy.createdAt;

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