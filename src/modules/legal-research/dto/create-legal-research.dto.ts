import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateLegalResearchDto {
  @ApiProperty({ example: 'Judicial Review in Constitutional Law' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Dr. Jane Doe' })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({ example: 'An abstract detailing the scope of judicial review.' })
  @IsString()
  @IsOptional()
  abstract?: string;

  @ApiPropertyOptional({ example: '# Introduction\nContent in markdown format...' })
  @IsString()
  @IsOptional()
  body_md?: string;

  @ApiPropertyOptional({ example: 'https://example.com/research-paper.pdf' })
  @IsString()
  @IsOptional()
  pdf_url?: string;

  @ApiPropertyOptional({ example: ['Constitution', 'Supreme Court'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}