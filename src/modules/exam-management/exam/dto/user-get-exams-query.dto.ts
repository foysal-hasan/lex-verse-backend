import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PkgProgram } from '@prisma/client';

export enum ExamStatusFilter {
  LIVE = 'live',
  UPCOMING = 'upcoming',
  ARCHIVED = 'archived',
}

export class UserGetExamsQueryDto {
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

  @ApiPropertyOptional({ enum: ExamStatusFilter, description: 'Filter by exam status: live, upcoming, or archived' })
  @IsEnum(ExamStatusFilter)
  @IsOptional()
  status?: ExamStatusFilter;

  @ApiPropertyOptional({ description: 'Filter by package ID' })
  @IsString()
  @IsOptional()
  package_id?: string;

  @ApiPropertyOptional({ enum: PkgProgram })
  @IsEnum(PkgProgram)
  @IsOptional()
  program?: PkgProgram;

  @ApiPropertyOptional({ description: 'Search term for exam title' })
  @IsString()
  @IsOptional()
  search?: string;
}