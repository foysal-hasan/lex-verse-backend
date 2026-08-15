import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PkgTrack } from 'src/generated/prisma/enums';

export class QuerySyllabusDto {
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

  @ApiPropertyOptional({ description: 'Search term for title or content' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: PkgTrack })
  @IsEnum(PkgTrack)
  @IsOptional()
  track?: PkgTrack;

  @ApiPropertyOptional({ description: 'Filter by specific package ID' })
  @IsString()
  @IsOptional()
  package_id?: string;

  @ApiPropertyOptional({ description: 'Sort field: created_at or title', default: 'created_at' })
  @IsString()
  @IsOptional()
  sort_by?: string = 'created_at';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsString()
  @IsOptional()
  sort_order?: 'asc' | 'desc' = 'desc';
}