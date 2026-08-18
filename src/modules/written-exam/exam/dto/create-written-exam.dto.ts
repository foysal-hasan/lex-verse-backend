import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsEnum, 
  IsNumber, 
  IsUUID, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PkgProgram, WrittenExamQuestionType } from 'src/generated/prisma/enums';
import { PackageWrittenExamMappingDto } from './package-written-exam-mapping.dto';



export class CreateWrittenExamDto {
  @ApiProperty({ 
    description: 'The global title of the written exam', 
    example: 'Comprehensive Final Written Examination' 
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({ 
    description: 'List of subjects covered under this written exam', 
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

  @ApiPropertyOptional({ 
    description: 'Total marks allocated for the written exam', 
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
  question_type_type: WrittenExamQuestionType;

  @ApiPropertyOptional({ 
    description: 'Optional question set identifier if questions are pulled from a question set', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsOptional()
  @IsUUID()
  question_set_id?: string;

  @ApiProperty({ 
    type: [PackageWrittenExamMappingDto], 
    description: 'List of packages where this exam will be scheduled and mapped' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageWrittenExamMappingDto)
  packages: PackageWrittenExamMappingDto[];
}

export class UpdateWrittenExamDto extends PartialType(CreateWrittenExamDto) {}