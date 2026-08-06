import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PkgProgram, PkgTrack } from 'src/generated/prisma/enums';


export class CreateBookReferenceDto {
  @ApiProperty({ enum: PkgProgram, isArray: true, example: [PkgProgram.bjs] })
  @IsArray()
  @IsEnum(PkgProgram, { each: true })
  @IsNotEmpty()
  program_type: PkgProgram[];

  @ApiProperty({ enum: PkgTrack, isArray: true, example: [PkgTrack.preliminary] })
  @IsArray()
  @IsEnum(PkgTrack, { each: true })
  @IsNotEmpty()
  track: PkgTrack[];

  @ApiProperty({ type: [String], example: ['Constitution', 'Articles'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  category: string[];

  @ApiPropertyOptional({ example: 'Introduction to BJS Civil Law' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Detailed text content of the reference material...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;
}