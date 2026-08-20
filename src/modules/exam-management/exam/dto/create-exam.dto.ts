import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PackageScheduleDto } from './package-schedule.dto';
import { ExamVisibility, PkgProgram, PkgTrack, WrittenExamQuestionType } from 'src/generated/prisma/enums';

export class CreateExamDto {
  @ApiProperty({ example: 'BCS Preliminary Model Test' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ type: [String], example: ['Mathematics', 'Bangla'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjects?: string[];

  @ApiPropertyOptional({ example: 'Exam description and rules.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: PkgProgram, example: PkgProgram.bar })
  @IsEnum(PkgProgram)
  @IsNotEmpty()
  program: PkgProgram;

  @ApiProperty({ enum: PkgTrack, example: PkgTrack.preliminary })
  @IsEnum(PkgTrack)
  @IsNotEmpty()
  track: PkgTrack;

  @ApiPropertyOptional({ example: 100, default: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  total_marks?: number;

  @ApiPropertyOptional({ example: 40, default: 40 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  pass_mark_percentage?: number;

  // Written Specific Fields
  @ApiPropertyOptional({ enum: WrittenExamQuestionType, example: WrittenExamQuestionType.multiple_questions })
  @IsEnum(WrittenExamQuestionType)
  @IsOptional()
  written_exam_question_type_type?: WrittenExamQuestionType;

  @ApiPropertyOptional({ example: '/written/abc.pdf' })
  @IsString()
  @IsOptional()
  written_exam_question_file_path?: string;

  @ApiPropertyOptional({ example: 'application/pdf' })
  @IsString()
  @IsOptional()
  written_exam_question_file_mime_type?: string;

  // MCQ Specific Fields
  @ApiPropertyOptional({ enum: ExamVisibility, default: ExamVisibility.public })
  @IsEnum(ExamVisibility)
  @IsOptional()
  visibility?: ExamVisibility;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  is_negative_marking?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  negative_mark_per_question?: number;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  is_free_demo?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  is_enabled_per_question_time_limit?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  per_question_time_limit?: number;

  @ApiPropertyOptional({ description: 'Link to a Question Set ID', example: 'uuid-123456' })
  @IsString()
  @IsOptional()
  question_set_id?: string;

  @ApiPropertyOptional({ type: [PackageScheduleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageScheduleDto)
  @IsOptional()
  packages?: PackageScheduleDto[];

  created_by?: string;
}