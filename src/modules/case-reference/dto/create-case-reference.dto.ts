import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCaseReferenceDto {
  @ApiProperty({ example: 'Kesavananda Bharati v. State of Kerala' })
  @IsString()
  @IsNotEmpty()
  case_title: string;

  @ApiPropertyOptional({ example: '1973 4 SCC 225' })
  @IsString()
  @IsOptional()
  citation?: string;

  @ApiPropertyOptional({ example: 'Supreme Court of India' })
  @IsString()
  @IsOptional()
  court?: string;

  @ApiPropertyOptional({ example: 1973 })
  @IsInt()
  @Min(1800)
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({ example: 'Landmark case defining the basic structure doctrine...' })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiPropertyOptional({ example: '<h1>Judgment</h1><p>Content...</p>' })
  @IsString()
  @IsOptional()
  content_html?: string;

  @ApiPropertyOptional({ example: 'Judgment Content...' })
  @IsString()
  @IsOptional()
  content_plain?: string;

  @ApiPropertyOptional({ example: 'uploads/case-references/judgment.pdf' })
  @IsString()
  @IsOptional()
  pdf_path?: string;

  @ApiPropertyOptional({ example: 'https://cdn.domain.com/uploads/case-references/judgment.pdf' })
  @IsString()
  @IsOptional()
  pdf_url?: string;

  @ApiPropertyOptional({ example: 'uploads/case-references/cover.jpg' })
  @IsString()
  @IsOptional()
  cover_image?: string;

  @ApiPropertyOptional({ example: 'Full Judgment Text...' })
  @IsString()
  @IsOptional()
  full_text?: string;

  @ApiPropertyOptional({ example: 'Constitutional Law' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: ['Constitutional Law', 'Basic Structure', 'Landmark'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = [];

  @ApiPropertyOptional({ example: 'Kesavananda Bharati Case Summary & Judgment' })
  @IsString()
  @IsOptional()
  meta_title?: string;

  @ApiPropertyOptional({ example: 'Detailed analysis of Kesavananda Bharati v. State of Kerala...' })
  @IsString()
  @IsOptional()
  meta_description?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  is_published?: boolean = true;
}