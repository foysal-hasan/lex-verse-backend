import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminAttachDetachQuestionsDto {
  @ApiProperty({
    type: [String],
    description: 'List of question IDs to attach or detach',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  question_ids: string[];
}