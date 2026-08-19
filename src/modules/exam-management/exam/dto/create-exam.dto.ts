import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
  IsUUID,
  ValidateNested,
  IsNotEmpty,
  ValidateIf
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PkgProgram, PkgTrack, WrittenExamQuestionType } from 'src/generated/prisma/enums';
import { PackageExamMappingDto } from './package-exam-mapping.dto';



export class CreateExamDto {
  @ApiProperty({
    description: 'The global title of the exam',
    example: 'Comprehensive Final Examination'
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'List of subjects covered under this exam',
    example: ['Mathematics', 'Physics']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @ApiPropertyOptional({
    description: 'Detailed description or general guidelines for the exam',
    example: 'All questions are compulsory. Show necessary calculations.'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: PkgProgram,
    description: 'The program type associated with this exam'
  })
  @IsEnum(PkgProgram)
  program: PkgProgram;

  @ApiProperty({
    enum: PkgTrack,
    description: 'The track associated with this exam'
  })
  @IsEnum(PkgTrack)
  track: PkgTrack;

  @ApiPropertyOptional({
    description: 'Total marks allocated for the exam',
    example: 100,
    default: 100
  })
  @IsOptional()
  @IsNumber()
  total_marks?: number;

  @ApiProperty({
    enum: WrittenExamQuestionType,
    description: 'Type of question setup (e.g., multiple questions or single document pdf/image)'
  })
  @IsEnum(WrittenExamQuestionType)
  written_exam_question_type_type: WrittenExamQuestionType;

  @ApiPropertyOptional({
    description: 'Question set identifier (Required if written_exam_question_type_type is multiple_questions)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ValidateIf((o) => o.written_exam_question_type_type === 'multiple_questions')
  @IsNotEmpty({ message: 'question_set_id is required when written_exam_question_type_type is multiple_questions' })
  @IsUUID()
  question_set_id?: string;

  @ApiPropertyOptional({ 
    description: 'File path for the exam document (Required if written_exam_question_type_type is single_document_pdf_or_image)', 
    example: '/exams/document.pdf' 
  })
  @ValidateIf((o) => o.written_exam_question_type_type === 'single_document_pdf_or_image')
  @IsNotEmpty({ message: 'written_exam_question_file_path is required when written_exam_question_type_type is single_document_pdf_or_image' })
  @IsString()
  written_exam_question_file_path?: string;

  @ApiPropertyOptional({ 
    description: 'Mime type of the file (Required if written_exam_question_type_type is single_document_pdf_or_image)', 
    example: 'application/pdf' 
  })
  @ValidateIf((o) => o.written_exam_question_type_type === 'single_document_pdf_or_image')
  @IsNotEmpty({ message: 'written_exam_question_file_mime_type is required when written_exam_question_type_type is single_document_pdf_or_image' })
  @IsString()
  written_exam_question_file_mime_type?: string;

  @ApiProperty({
    type: [PackageExamMappingDto],
    description: 'List of packages where this exam will be scheduled and mapped'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageExamMappingDto)
  packages: PackageExamMappingDto[];

  // created by
  created_by?: string
}
