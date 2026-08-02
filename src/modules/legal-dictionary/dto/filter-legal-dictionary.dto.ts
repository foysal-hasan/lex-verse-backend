import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt, Min, Length } from 'class-validator';
import { Type } from 'class-transformer';

export enum LegalDictionarySortBy {
  createdAt = 'created_at',
  termEn = 'term_en',
  termBn = 'term_bn',
}

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export class FilterLegalDictionaryDto {
  @ApiPropertyOptional({ example: 'Affidavit' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'A', description: 'Filter terms starting with a specific letter' })
  @IsString()
  @Length(1, 1)
  @IsOptional()
  startsWith?: string;

  @ApiPropertyOptional({ example: 'Criminal Law' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ enum: LegalDictionarySortBy, default: LegalDictionarySortBy.termEn })
  @IsEnum(LegalDictionarySortBy)
  @IsOptional()
  sortBy?: LegalDictionarySortBy = LegalDictionarySortBy.termEn;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.asc })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.asc;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;
}