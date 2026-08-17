import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { PkgProgram, PkgTrack } from 'src/generated/prisma/enums';
import { PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from '../question/dto/create-question.dto';

export class CreateQuestionSetDto {
  @IsString()
  title: string;

  @IsEnum(PkgProgram)
  program: PkgProgram;

  @IsEnum(PkgTrack)
  track: PkgTrack;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}

export class UpdateQuestionSetDto extends PartialType(CreateQuestionSetDto) {}