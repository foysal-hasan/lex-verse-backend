import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PkgProgram, PkgTrack } from 'src/generated/prisma/enums';

export class QueryRoutineAdminDto {
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

  @ApiPropertyOptional({ description: 'Search title or description' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: PkgProgram })
  @IsEnum(PkgProgram)
  @IsOptional()
  program_type?: PkgProgram;

  @ApiPropertyOptional({ enum: PkgTrack })
  @IsEnum(PkgTrack)
  @IsOptional()
  track?: PkgTrack;

  @ApiPropertyOptional({ description: 'Filter by routine type' })
  @IsString()
  @IsOptional()
  routine_type?: string;

  @ApiPropertyOptional({ enum: ['upcoming', 'active', 'archived'], description: 'Filter by status' })
  @IsString()
  @IsOptional()
  status?: 'upcoming' | 'active' | 'archived';

  @ApiPropertyOptional({ description: 'Filter by package ID or pass "none" for program-wide only routines' })
  @IsString()
  @IsOptional()
  package_id?: string;
}