import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PkgReqStatus, PkgAccStatus } from '@prisma/client';

export enum SortOrder {
  newest = 'newest',
  oldest = 'oldest',
}

export class QueryPackageAccessRequestDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ enum: PkgReqStatus })
  @IsEnum(PkgReqStatus)
  @IsOptional()
  status?: PkgReqStatus;

  @ApiPropertyOptional({ description: 'Filter by specific user ID (Admin only)' })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({ description: 'Search name, phone, or transaction_id' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.newest })
  @IsEnum(SortOrder)
  @IsOptional()
  sort?: SortOrder = SortOrder.newest;
}

export class QueryUserPackageAccessDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ enum: PkgAccStatus })
  @IsEnum(PkgAccStatus)
  @IsOptional()
  status?: PkgAccStatus;

  @ApiPropertyOptional({ description: 'Filter by package ID' })
  @IsString()
  @IsOptional()
  package_id?: string;
}

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}