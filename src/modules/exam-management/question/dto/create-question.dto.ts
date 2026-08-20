import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested, IsNumber, Min, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateOptionDto } from './create-option.dto';
import { ExamFormat } from 'src/generated/prisma/enums';

export class CreateQuestionDto {
  @ApiProperty({ enum: ExamFormat, example: ExamFormat.MCQ, description: 'Discriminator for MCQ or WRITTEN' })
  @IsEnum(ExamFormat)
  @IsNotEmpty()
  format: ExamFormat;

  @ApiProperty({ example: 'What is the capital of France?' })
  @IsString()
  @IsNotEmpty()
  question_text: string;

  @ApiPropertyOptional({ example: '/questions/q1.png' })
  @IsString()
  @IsOptional()
  question_file_path?: string;

  @ApiPropertyOptional({ example: 'image/png' })
  @IsString()
  @IsOptional()
  question_file_mime_type?: string;

  // --- MCQ Specific Fields (Required if format is MCQ) ---
  @ApiPropertyOptional({ type: [CreateOptionDto], description: 'Options required if format is MCQ' })
  @ValidateIf((o) => o.format === ExamFormat.MCQ)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  @IsNotEmpty()
  options?: CreateOptionDto[];

  @ApiPropertyOptional({ example: 'A', description: 'Correct answer key' })
  @ValidateIf((o) => o.format === ExamFormat.MCQ)
  @IsString()
  @IsOptional()
  correct_answer?: string;

  @ApiPropertyOptional({ example: 'Paris is the largest city and capital of France.' })
  @IsString()
  @IsOptional()
  explanation_text?: string;

  @ApiPropertyOptional({ example: 'x^2 + y^2 = r^2' })
  @IsString()
  @IsOptional()
  explanation_math?: string;

  @ApiPropertyOptional({ example: '/explanations/exp1.png' })
  @IsString()
  @IsOptional()
  explanation_file_path?: string;

  @ApiPropertyOptional({ example: 'image/png' })
  @IsString()
  @IsOptional()
  explanation_file_mime_type?: string;

  // --- Written Exam Specific Fields (Required/Optional if format is WRITTEN) ---
  @ApiPropertyOptional({ example: 10, default: 10, description: 'Marks for written question' })
  @ValidateIf((o) => o.format === ExamFormat.WRITTEN)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  marks?: number;

  @ApiPropertyOptional({ example: 'Write your answer step-by-step showing all calculations.' })
  @ValidateIf((o) => o.format === ExamFormat.WRITTEN)
  @IsString()
  @IsOptional()
  guidelines?: string;
}