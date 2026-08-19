import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  ValidateNested, 
  IsUUID 
} from 'class-validator';
import { Type } from 'class-transformer';
import { PkgProgram, PkgTrack } from 'src/generated/prisma/enums';
import { CreateQuestionDto } from '../../question/dto/create-question.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuestionSetDto {
  @ApiProperty({ 
    description: 'The title of the question set', 
    example: 'Advanced Mathematics Midterm Set A' 
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    enum: PkgProgram, 
    description: 'The program category for the question set' 
  })
  @IsEnum(PkgProgram)
  program: PkgProgram;

  @ApiProperty({ 
    enum: PkgTrack, 
    description: 'The track category for the question set' 
  })
  @IsEnum(PkgTrack)
  track: PkgTrack;

  @ApiPropertyOptional({ 
    description: 'Optional description or instructions for the question set',
    example: 'Answer all questions. Calculators are allowed.' 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    type: [String], 
    description: 'List of existing question IDs to connect to this question set',
    example: ['123e4567-e89b-12d3-a456-426614174000']
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  question_ids?: string[];

  @ApiPropertyOptional({ 
    type: [CreateQuestionDto], 
    description: 'List of new questions to be created and linked to this question set' 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[];
}