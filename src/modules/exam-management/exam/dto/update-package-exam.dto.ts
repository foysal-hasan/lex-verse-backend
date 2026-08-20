import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePackageExamDto {
  @ApiPropertyOptional({ example: 'Updated Mock Exam Schedule Title' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'routine-uuid-1' })
  @IsString()
  @IsOptional()
  routine_id?: string;

  @ApiPropertyOptional({ example: '2026-06-15T10:00:00.000Z' })
  @IsString()
  @IsOptional()
  start_datetime?: string;

  @ApiPropertyOptional({ example: '2026-06-15T13:00:00.000Z' })
  @IsString()
  @IsOptional()
  end_datetime?: string;
}