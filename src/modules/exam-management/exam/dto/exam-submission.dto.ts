import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty({ description: 'Question ID', example: 'uuid-string' })
  @IsUUID()
  @IsNotEmpty()
  question_id: string;

  @ApiProperty({ description: 'Selected Option ID', example: 'uuid-string' })
//   @IsUUID()
  @IsNotEmpty()
  selected_option_id: string;
}

export class SubmitWrittenExamDto {
  @ApiProperty({ description: 'Active Exam Attempt ID', example: 'uuid-string' })
  @IsUUID()
  @IsNotEmpty()
  attempt_id: string;

  @ApiProperty({ description: 'Exam ID', example: 'uuid-string' })
  @IsUUID()
  @IsNotEmpty()
  exam_id: string;

  @ApiProperty({ description: 'Package ID', example: 'uuid-string' })
  @IsUUID()
  @IsNotEmpty()
  package_id: string;

  @ApiPropertyOptional({ description: 'Text response', example: 'My essay answer...' })
  @IsString()
  @IsOptional()
  text_answer?: string;

  @ApiPropertyOptional({ description: 'Uploaded file path', example: '/uploads/exam.pdf' })
  @IsString()
  @IsOptional()
  file_path?: string;
}

export class ResubmissionRequestDto {
  @ApiProperty({ description: 'Exam ID', example: 'uuid-string' })
  @IsUUID()
  @IsNotEmpty()
  exam_id: string;

  @ApiProperty({ description: 'Reason', example: 'Uploaded wrong file format.' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}