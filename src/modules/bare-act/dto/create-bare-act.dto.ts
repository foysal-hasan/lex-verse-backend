import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum BareActSourceType {
  TEXT = 'text',
  PDF = 'pdf',
  BOTH = 'both',
}

export class CreateBareActDto {
  @ApiProperty({ example: 'The Code of Criminal Procedure, 1973' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Criminal Law' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: '<h1>Section 1</h1><p>Short title...</p>' })
  @IsString()
  @IsOptional()
  content_html?: string;

  @ApiPropertyOptional({ example: 'Section 1. Short title...' })
  @IsString()
  @IsOptional()
  content_plain?: string;

  @ApiPropertyOptional({ enum: BareActSourceType, default: BareActSourceType.TEXT })
  @IsEnum(BareActSourceType)
  @IsOptional()
  source_type?: BareActSourceType = BareActSourceType.TEXT;

  @ApiPropertyOptional({ example: 'uploads/bare-acts/crpc-1973.pdf' })
  @IsString()
  @IsOptional()
  pdf_path?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  allow_download?: boolean = true;
}