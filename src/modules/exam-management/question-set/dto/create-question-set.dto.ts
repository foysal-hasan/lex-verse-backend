import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PkgProgram, PkgTrack } from 'src/generated/prisma/enums';
import { CreateQuestionDto } from '../../question/dto/create-question.dto';


export class CreateQuestionSetDto {
  @ApiProperty({ example: 'BCS Preliminary Model Test Set 1' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: PkgProgram, example: PkgProgram.bar })
  @IsEnum(PkgProgram)
  @IsNotEmpty()
  program: PkgProgram;

  @ApiProperty({ enum: PkgTrack, example: PkgTrack.preliminary })
  @IsEnum(PkgTrack)
  @IsNotEmpty()
  track: PkgTrack;

  @ApiPropertyOptional({ example: 'Complete set covering Bangladesh Affairs.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ type: [String], description: 'Existing question IDs to connect', example: ['uuid-1', 'uuid-2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  question_ids?: string[];

  @ApiPropertyOptional({ type: [CreateQuestionDto], description: 'New questions to create and attach' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @IsOptional()
  new_questions?: CreateQuestionDto[];
}