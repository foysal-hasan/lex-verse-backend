import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PkgProgram, PkgTrack } from 'src/generated/prisma/enums';

export class CreateBookReferenceDto {
  @ApiProperty({ example: 'Introduction to Constitutional Law' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Full markdown or HTML text content...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: PkgProgram, isArray: true, example: [PkgProgram.bar] })
  @IsEnum(PkgProgram, { each: true })
  @IsArray()
  program_type: PkgProgram[];

  @ApiPropertyOptional({ enum: PkgTrack, isArray: true, example: [PkgTrack.preliminary] })
  @IsEnum(PkgTrack, { each: true })
  @IsArray()
  @IsOptional()
  track?: PkgTrack[];

  @ApiPropertyOptional({ type: [String], example: ['Constitutional'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  category?: string[];

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @ApiPropertyOptional({ default: false, description: 'True if only purchased users can view this book' })
  @IsBoolean()
  @IsOptional()
  requires_purchase?: boolean;

  @ApiPropertyOptional({ type: [String], description: 'Package IDs to attach on creation', example: ['pkg-uuid-1'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  package_ids?: string[];
}