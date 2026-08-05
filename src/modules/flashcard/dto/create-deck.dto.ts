import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateCardItemDto {
  @ApiProperty({ example: 'What is TypeScript?' })
  @IsString()
  @IsNotEmpty()
  front_text: string;

  @ApiProperty({ example: 'A typed superset of JavaScript.' })
  @IsString()
  @IsNotEmpty()
  back_text: string;

  @ApiPropertyOptional({ example: 'https://example.com/front.png' })
  @IsString()
  @IsOptional()
  front_image?: string;

  @ApiPropertyOptional({ example: 'https://example.com/back.png' })
  @IsString()
  @IsOptional()
  back_image?: string;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  order_index?: number;

  @ApiPropertyOptional({ default: true, description: 'True for published/active, false for draft' })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class CreateDeckDto {
  @ApiProperty({ example: 'Advanced TypeScript' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Deep dive into TS types and generics.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Programming' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ type: [CreateCardItemDto], description: 'Optional initial cards' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCardItemDto)
  @IsOptional()
  cards?: CreateCardItemDto[];
}