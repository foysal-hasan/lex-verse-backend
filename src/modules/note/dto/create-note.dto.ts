import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDecimal, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { NoteTier } from 'src/generated/prisma/enums';

export class CreateNoteDto {
  @ApiProperty({ example: 'Advanced Constitutional Law Notes' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Comprehensive guide covering foundational articles.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Constitutional Law' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiPropertyOptional({ enum: NoteTier, default: NoteTier.free })
  @IsEnum(NoteTier)
  @IsOptional()
  tier?: NoteTier;

  @ApiPropertyOptional({ example: '/uploads/notes/file.pdf' })
  @IsString()
  @IsOptional()
  file_path?: string;

  @ApiPropertyOptional({ example: 'application/pdf' })
  @IsString()
  @IsOptional()
  file_mime?: string;

  @ApiPropertyOptional({ example: '/uploads/notes/preview.pdf' })
  @IsString()
  @IsOptional()
  preview_file_path?: string;

  @ApiPropertyOptional({ example: 'application/pdf' })
  @IsString()
  @IsOptional()
  preview_file_mime?: string;

  @ApiPropertyOptional({ example: 500 })
  @Type(() => Number)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 400 })
  @Type(() => Number)
  @IsOptional()
  discount_price?: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @ApiPropertyOptional({ type: [String], example: ['pkg-uuid-1'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  package_ids?: string[];
}