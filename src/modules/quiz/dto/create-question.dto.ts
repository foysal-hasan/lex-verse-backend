import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNumber, IsObject } from 'class-validator';

export class CreateQuestionDto {
  @ApiPropertyOptional({ example: { a: 'Option A', b: 'Option B' } })
  @IsObject()
  @IsOptional()
  options?: Record<string, any>;

  @ApiPropertyOptional({ example: 'a' })
  @IsString()
  @IsOptional()
  correct_answer?: string;

  @ApiPropertyOptional({ example: 'What is the capital of Bangladesh?' })
  @IsString()
  @IsOptional()
  question_text?: string;

  @ApiPropertyOptional({ example: 30, default: 30 })
  @IsInt()
  @IsOptional()
  time_limit?: number;

  @ApiPropertyOptional({ example: 'mcq', default: 'mcq' })
  @IsString()
  @IsOptional()
  question_type?: string;

  @ApiPropertyOptional({ example: 'https://example.com/question-image.png' })
  @IsString()
  @IsOptional()
  question_image?: string;

  @ApiPropertyOptional({ example: 'Dhaka is the capital.' })
  @IsString()
  @IsOptional()
  explanation_text?: string;

  @ApiPropertyOptional({ example: 'x^2 + y^2 = r^2' })
  @IsString()
  @IsOptional()
  explanation_math?: string;

  @ApiPropertyOptional({ example: 'https://example.com/explanation-image.png' })
  @IsString()
  @IsOptional()
  explanation_image?: string;

  @ApiPropertyOptional({ example: 0.25, default: 0 })
  @IsNumber()
  @IsOptional()
  negative_marks?: number;

  @ApiPropertyOptional({ example: 'section-uuid-here' })
  @IsString()
  @IsOptional()
  section_id?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  section_position?: number;
}