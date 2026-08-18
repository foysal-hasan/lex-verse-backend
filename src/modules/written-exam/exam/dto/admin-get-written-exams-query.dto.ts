import { IsOptional, IsString, IsInt, Min, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PkgProgram } from 'src/generated/prisma/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AdminGetWrittenExamsQueryDto {
  @ApiPropertyOptional({ default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search term for title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: PkgProgram, description: 'Filter by program' })
  @IsOptional()
  @IsEnum(PkgProgram)
  program?: PkgProgram;

  @ApiPropertyOptional({ description: 'Filter by mapped package ID' })
  @IsOptional()
  @IsUUID()
  package_id?: string;
}