import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { PkgProgram, PkgTrack } from '@prisma/client';

export class QueryBookReferenceDto {
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

  @ApiPropertyOptional({ description: 'Fetch book references linked to a specific Package ID' })
  @IsUUID()
  @IsOptional()
  package_id?: string;

  @ApiPropertyOptional({ description: 'Search title or content' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: PkgProgram })
  @IsEnum(PkgProgram)
  @IsOptional()
  program_type?: PkgProgram;

  @ApiPropertyOptional({ enum: PkgTrack })
  @IsEnum(PkgTrack)
  @IsOptional()
  track?: PkgTrack;

  @ApiPropertyOptional({ description: 'Filter by specific category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter published status (Admin only)' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;
}