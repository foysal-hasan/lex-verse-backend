import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { NoteTier } from '@prisma/client';

export class QueryNoteDto {
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

  @ApiPropertyOptional({ description: 'Search term for title or description' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by subject' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiPropertyOptional({ enum: NoteTier })
  @IsEnum(NoteTier)
  @IsOptional()
  tier?: NoteTier;

  @ApiPropertyOptional({ description: 'Filter by linked package ID' })
  @IsString()
  @IsOptional()
  package_id?: string;
}