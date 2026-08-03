import { PartialType } from '@nestjs/swagger';
import { CreateCaseReferenceDto } from './create-case-reference.dto';

export class UpdateCaseReferenceDto extends PartialType(CreateCaseReferenceDto) {}
