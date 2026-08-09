import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsBoolean,
  IsNumber,
  IsObject,
  IsDateString
} from 'class-validator';
import { PkgDuration, PkgKind, PkgProgram, PkgTrack } from 'src/generated/prisma/enums';



export class CreatePackageDto {
  @ApiProperty({ enum: PkgProgram, example: PkgProgram.bjs })
  @IsEnum(PkgProgram)
  program: PkgProgram;

  @ApiPropertyOptional({ enum: PkgTrack, example: PkgTrack.preliminary })
  @IsEnum(PkgTrack)
  @IsOptional()
  track?: PkgTrack;

  @ApiProperty({ enum: PkgKind, example: PkgKind.batch })
  @IsEnum(PkgKind)
  kind: PkgKind;

  @ApiPropertyOptional({ enum: PkgDuration, example: PkgDuration.monthly })
  @IsEnum(PkgDuration)
  @IsOptional()
  duration?: PkgDuration;

  @ApiProperty({ example: 'বিজেএস প্রিলিমিনারি ব্যাচ ২০২৬' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'সেরা প্রস্তুতি নিশ্চিত করুন' })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  batch_number?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  is_coming_soon?: boolean;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsInt()
  @IsOptional()
  sort_order?: number;

  @ApiPropertyOptional({ example: '2026-06-01T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  batch_started_at?: string;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.000Z' })
  @IsDateString()
  @IsOptional()
  batch_ended_at?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  batch_locks_new_only?: boolean;

  @ApiPropertyOptional({ example: { feature: 'live_classes' } })
  @IsObject()
  @IsOptional()
  details_json?: Record<string, any>;

  @ApiPropertyOptional({ example: '<p>Detailed description HTML</p>' })
  @IsString()
  @IsOptional()
  details_html?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  allow_program_routine_fallback?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  includes_all_notes?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  includes_all_qbanks?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  includes_all_premium?: boolean;

  @ApiPropertyOptional({ example: 1500.00, default: 0 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 1500.00, default: 0 })
  @IsNumber()
  @IsOptional()
  discount_price?: number;
}