import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateQuestionSetDto } from './create-question-set.dto';

export class UpdateQuestionSetDto extends PartialType(
  OmitType(CreateQuestionSetDto, ['question_ids'] as const),
) {}