import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsEnum, 
  IsNumber, 
  IsUUID, 
  IsDateString, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { PkgProgram, WrittenExamQuestionType } from 'src/generated/prisma/enums';

class PackageWrittenExamMappingDto {
  @IsUUID()
  package_id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsUUID()
  routine_id?: string;

  @IsDateString()
  start_datetime: string;

  @IsDateString()
  end_datetime: string;
}

export class CreateWrittenExamDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PkgProgram)
  program: PkgProgram;

  @IsOptional()
  @IsNumber()
  total_marks?: number;

  @IsEnum(WrittenExamQuestionType)
  question_type_type: WrittenExamQuestionType;

  @IsOptional()
  @IsUUID()
  question_set_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageWrittenExamMappingDto)
  packages: PackageWrittenExamMappingDto[];
}

export class UpdateWrittenExamDto extends PartialType(CreateWrittenExamDto) {}