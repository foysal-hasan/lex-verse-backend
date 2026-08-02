import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsInt, 
  IsBoolean, 
  IsNumber, 
  IsArray, 
  ValidateNested, 
  IsDateString 
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionDto } from './create-question.dto';

export class CreateQuizWithQuestionsDto {
  @ApiPropertyOptional({ example: 'BJS Preliminary Model Test 1' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Comprehensive test for BJS preparation' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 3600, description: 'Time limit in seconds' })
  @IsInt()
  @IsOptional()
  time_limit?: number;

  @ApiPropertyOptional({ example: 'upcoming', default: 'upcoming' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  has_negative_marking?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  allow_answer_change?: boolean;

  @ApiPropertyOptional({ example: 0.25, default: 0.25 })
  @IsNumber()
  @IsOptional()
  negative_mark_value?: number;

  @ApiPropertyOptional({ example: 'general', default: 'general' })
  @IsString()
  @IsOptional()
  program_type?: string;

  @ApiPropertyOptional({ example: 'preliminary', default: 'preliminary' })
  @IsString()
  @IsOptional()
  exam_type?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  is_live?: boolean;

  @ApiPropertyOptional({ example: '2026-06-01T10:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  live_start_time?: string;

  @ApiPropertyOptional({ example: '2026-06-01T11:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  live_end_time?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  is_premium?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/archive-quiz.pdf' })
  @IsString()
  @IsOptional()
  archive_pdf_url?: string;

  @ApiPropertyOptional({ example: 'Constitutional Law' })
  @IsString()
  @IsOptional()
  subject_tag?: string;

  @ApiPropertyOptional({ example: ['bjs', 'bar'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  program_types?: string[];

  @ApiPropertyOptional({ example: 100 })
  @IsInt()
  @IsOptional()
  total_questions?: number;

  @ApiPropertyOptional({ example: 100.00 })
  @IsNumber()
  @IsOptional()
  total_marks?: number;

  @ApiPropertyOptional({ example: 40.00 })
  @IsNumber()
  @IsOptional()
  cut_mark_percent?: number;

  @ApiPropertyOptional({ type: [CreateQuestionDto], description: 'List of questions to create with the quiz' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @IsOptional()
  questions?: CreateQuestionDto[];
}