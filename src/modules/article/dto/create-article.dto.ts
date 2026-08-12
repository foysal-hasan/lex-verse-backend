import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Understanding Constitutional Law' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    example: 'understanding-constitutional-law', 
    description: 'Custom slug. If left empty, it will be auto-generated from the title.' 
  })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
    message: 'Slug must be lowercase alphanumeric and can contain hyphens only (e.g., my-article-slug).' 
  })
  slug: string;

  @ApiPropertyOptional({ example: 'A brief summary of constitutional law principles...' })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiPropertyOptional({ example: 'Full detailed content of the article...' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' }) // uuid of the author/user
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  author_id: string;

  @ApiPropertyOptional({ example: 'Legal' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ type: [String], example: ['law', 'constitution'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsString()
  @IsOptional()
  cover_image?: string;

  @ApiPropertyOptional({ example: 'https://example.com/banner.jpg' })
  @IsString()
  @IsOptional()
  banner_image?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @ApiPropertyOptional({ example: 'SEO Title Here' })
  @IsString()
  @IsOptional()
  seo_meta_title?: string;

  @ApiPropertyOptional({ example: 'SEO Description Here' })
  @IsString()
  @IsOptional()
  seo_meta_description?: string;

  @ApiPropertyOptional({ type: [String], example: ['keyword1', 'keyword2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  seo_keywords?: string[];
}