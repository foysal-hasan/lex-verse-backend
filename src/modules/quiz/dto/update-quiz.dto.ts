import { PartialType } from '@nestjs/swagger';
import { CreateQuizWithQuestionsDto } from './create-quiz-with-questions.dto';

export class UpdateQuizDto extends PartialType(CreateQuizWithQuestionsDto) {}