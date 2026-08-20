import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PackageScheduleDto {
  @ApiProperty({ example: 'package-uuid-1' })
  @IsString()
  @IsNotEmpty()
  package_id: string;

  @ApiProperty({ example: 'Final Mock Exam Schedule Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'routine-uuid-1' })
  @IsString()
  @IsOptional()
  routine_id?: string;

  @ApiProperty({ example: '2026-06-15T10:00:00.000Z' })
  @IsNotEmpty()
  start_datetime: string;

  @ApiProperty({ example: '2026-06-15T13:00:00.000Z' })
  @IsNotEmpty()
  end_datetime: string;
}