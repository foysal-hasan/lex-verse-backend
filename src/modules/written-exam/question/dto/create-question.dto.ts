import { 
  IsString, 
  IsOptional, 
  IsNumber, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ description: 'The question text', example: 'What is the capital of France?' })
  @IsString()
  question_text: string;

  @ApiPropertyOptional({ description: 'The path to the question file', example: '/questions/1234567890.pdf' })
  @IsOptional()
  @IsString()
  question_file_path?: string;

  @ApiPropertyOptional({ description: 'The MIME type of the question file', example: 'application/pdf' })
  @IsOptional()
  @IsString()
  question_file_mime_type?: string;

  @ApiPropertyOptional({ description: 'The marks for the question', example: 10  })
  @IsOptional()
  @IsNumber()
  marks?: number;

  @ApiPropertyOptional({ description: 'The guidelines for the question', example: 'Answer in question format' })
  @IsOptional()
  @IsString()
  guidelines?: string;
}