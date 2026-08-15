import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { PkgProgram } from 'src/generated/prisma/enums';

export class QueryRoutineUserDto {
  @ApiProperty({ description: 'Package ID required for fetching package routines' })
  @IsString()
  @IsNotEmpty()
  package_id: string;

  @ApiProperty({ enum: PkgProgram, example: PkgProgram.bjs })
  @IsEnum(PkgProgram)
  @IsNotEmpty()
  program_type: PkgProgram;

  @ApiPropertyOptional({ enum: ['all', 'remain', 'done'], default: 'all', description: 'Filter routines by completion status based on exam date' })
  @IsString()
  @IsOptional()
  filter?: 'all' | 'remain' | 'done' = 'all';

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

  @ApiPropertyOptional({ description: 'Search term for routine title' })
  @IsString()
  @IsOptional()
  search?: string;
}