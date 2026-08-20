import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AdminAttachDetachQuestionsDto {
  @ApiProperty({ type: [String], example: ['question-uuid-1', 'question-uuid-2'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  question_ids: string[];
}