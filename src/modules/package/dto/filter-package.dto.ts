import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { PkgProgram, PkgTrack, PkgKind } from 'src/generated/prisma/enums';

export enum PackageSortBy {
  createdAt = 'created_at',
  sortOrder = 'sort_order',
  priceBdt = 'price_bdt',
}

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export class FilterPackageDto {
  @ApiPropertyOptional({ enum: PkgProgram, description: 'Program type of the package' })
  @IsEnum(PkgProgram)
  @IsOptional()
  program?: PkgProgram;

  @ApiPropertyOptional({ enum: PkgTrack, description: 'Track type of the package' })
  @IsEnum(PkgTrack)
  @IsOptional()
  track?: PkgTrack;

  @ApiPropertyOptional({ enum: PkgKind, description: 'Kind of the package' })
  @IsEnum(PkgKind)
  @IsOptional()
  kind?: PkgKind;

  @ApiPropertyOptional({ description: 'Search by package name' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: true, description: 'Filter by active status (Admin only override)' })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ enum: PackageSortBy, description: 'Sort by field', default: PackageSortBy.sortOrder })
  @IsEnum(PackageSortBy)
  @IsOptional()
  sortBy?: PackageSortBy = PackageSortBy.sortOrder;

  @ApiPropertyOptional({ enum: SortOrder, description: 'Sort order', default: SortOrder.asc })
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