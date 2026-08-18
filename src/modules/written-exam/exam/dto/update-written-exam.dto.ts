import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { CreateWrittenExamDto } from './create-written-exam.dto';

export class UpdateWrittenExamDto extends PartialType(
  OmitType(CreateWrittenExamDto, ['packages'] as const),
) {}



