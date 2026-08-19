import {
    IsArray,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';

export class BulkUploadQuestionsDto {
    @IsArray()
    @ApiProperty({
        description: 'The list of questions to upload', example: [{
            question_text: 'What is the capital of France?',
            question_file_path: '/questions/1234567890.pdf',
            question_file_mime_type: 'application/pdf',
            marks: 10,
            guidelines: 'Answer in question format'
        }]
    })
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[];
}