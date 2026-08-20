import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PkgProgram, PkgTrack } from '@prisma/client';

export class AdminGetQuestionSetsQueryDto {
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

  @ApiPropertyOptional({ enum: PkgProgram })
  @IsEnum(PkgProgram)
  @IsOptional()
  program?: PkgProgram;

  @ApiPropertyOptional({ enum: PkgTrack })
  @IsEnum(PkgTrack)
  @IsOptional()
  track?: PkgTrack;
}