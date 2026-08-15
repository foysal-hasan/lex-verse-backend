import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PkgProgram, PkgTrack, RoutineVisibilityScope } from 'src/generated/prisma/enums';
import { Type } from 'class-transformer';

export class CreateRoutineDto {
  @ApiProperty({ enum: PkgProgram, example: PkgProgram.bjs })
  @IsEnum(PkgProgram)
  @IsNotEmpty()
  program_type: PkgProgram;

  @ApiPropertyOptional({ enum: PkgTrack, example: PkgTrack.preliminary })
  @IsEnum(PkgTrack)
  @IsOptional()
  track?: PkgTrack;

  @ApiProperty({ example: 'Exam' })
  @IsString()
  @IsNotEmpty()
  routine_type: string;

  @ApiPropertyOptional({ example: 'Routine #01' })
  @IsString()
  @IsOptional()
  routine_number?: string;

  @ApiPropertyOptional({ example: '2026-06-15T10:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  exam_date?: string;

  @ApiPropertyOptional({ example: 2026 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  academic_year?: number;

  @ApiPropertyOptional({ example: 'Session 2026' })
  @IsString()
  @IsOptional()
  session_label?: string;

  @ApiProperty({ example: 'Preliminary Mock Test Routine' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Routine details and guidelines.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'application/pdf' })
  @IsString()
  @IsOptional()
  file_mime_type?: string;

  @ApiPropertyOptional({ example: '/uploads/routines/routine-1.pdf' })
  @IsString()
  @IsOptional()
  file_path?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  is_archived?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  is_pinned?: boolean;

  @ApiProperty({ enum: RoutineVisibilityScope, example: RoutineVisibilityScope.premium })
  @IsEnum(RoutineVisibilityScope)
  @IsNotEmpty()
  visibility_scope: RoutineVisibilityScope;

  @ApiPropertyOptional({ description: 'Link to a package ID. Leave empty/null for program-wide routines.', example: 'pkg-uuid-1' })
  @IsString()
  @IsOptional()
  package_id?: string;
}