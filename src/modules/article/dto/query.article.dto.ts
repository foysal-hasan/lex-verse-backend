import {  ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator';

export class QueryArticleDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'constitutional' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'Legal' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'law' })
  @IsString()
  @IsOptional()
  tag?: string;
}


export class QueryAdminArticleDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'constitutional' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'Legal' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'law' })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({ example: true, description: 'Filter by published status' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;
}