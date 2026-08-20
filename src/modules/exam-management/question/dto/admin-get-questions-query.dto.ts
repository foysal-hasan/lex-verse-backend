import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ExamFormat } from '@prisma/client';

export class AdminGetQuestionsQueryDto {
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

  @ApiPropertyOptional({ description: 'Search question text' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: ExamFormat, description: 'Filter by question format' })
  @IsEnum(ExamFormat)
  @IsOptional()
  format?: ExamFormat;
}