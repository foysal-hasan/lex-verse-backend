import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateCardItemDto } from './create-deck.dto';

export class AddCardsDto {
  @ApiProperty({ type: [CreateCardItemDto], description: 'One or many cards to add' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCardItemDto)
  @IsNotEmpty()
  cards: CreateCardItemDto[];
}

export class RemoveCardsDto {
  @ApiProperty({ example: ['card-uuid-1', 'card-uuid-2'], description: 'Array of card IDs to remove' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  card_ids: string[];
}