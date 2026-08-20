import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOptionDto {
  @ApiPropertyOptional({ example: 'A', description: 'Option key like A, B, C, D' })
  @IsString()
  @IsOptional()
  option_key?: string;

  @ApiProperty({ example: 'Paris', description: 'The text for the option' })
  @IsString()
  @IsNotEmpty()
  option_text: string;
}