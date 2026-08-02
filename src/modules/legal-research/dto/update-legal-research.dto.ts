import { PartialType } from '@nestjs/swagger';
import { CreateLegalResearchDto } from './create-legal-research.dto';

export class UpdateLegalResearchDto extends PartialType(CreateLegalResearchDto) {}
