import { PartialType } from '@nestjs/swagger';
import { CreateSuggestionDto } from './create-suggestion.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSuggestionDto extends PartialType(CreateSuggestionDto) {
  @ApiPropertyOptional({ description: 'Toggle active status' })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}