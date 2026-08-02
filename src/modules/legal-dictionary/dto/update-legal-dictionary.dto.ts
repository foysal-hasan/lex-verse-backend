import { PartialType } from '@nestjs/swagger';
import { CreateLegalDictionaryDto } from './create-legal-dictionary.dto';

export class UpdateLegalDictionaryDto extends PartialType(CreateLegalDictionaryDto) {}
