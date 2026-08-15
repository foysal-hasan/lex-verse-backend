import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PkgTrack } from 'src/generated/prisma/enums';

export class CreateSyllabusDto {
  @ApiProperty({ example: 'Complete Law Syllabus 2026' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ enum: PkgTrack, example: PkgTrack.preliminary })
  @IsEnum(PkgTrack)
  @IsOptional()
  track?: PkgTrack;

  @ApiPropertyOptional({ example: 'Detailed breakdown of modules and topics.' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ example: '/uploads/syllabus/guide.pdf' })
  @IsString()
  @IsOptional()
  file_path?: string;

  @ApiPropertyOptional({ example: 'application/pdf' })
  @IsString()
  @IsOptional()
  file_mime_type?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @ApiPropertyOptional({ type: [String], example: ['pkg-uuid-1'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  package_ids?: string[];
}