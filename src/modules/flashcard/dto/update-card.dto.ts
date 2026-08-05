import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCardItemDto } from './create-deck.dto';

export class UpdateCardDto extends PartialType(CreateCardItemDto) {}