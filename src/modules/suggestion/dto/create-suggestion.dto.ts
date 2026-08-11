import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PkgProgram, PkgTrack } from 'src/generated/prisma/enums';

export class CreateSuggestionDto {
  @ApiProperty({ example: 'Constitutional Law Overview' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Detailed text content of the suggestion...' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ example: 'General' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'parent-uuid-if-sub-suggestion' })
  @IsString()
  @IsOptional()
  parent_id?: string;

  @ApiPropertyOptional({ enum: PkgProgram, isArray: true, example: [PkgProgram.bar] })
  @IsEnum(PkgProgram, { each: true })
  @IsArray()
  @IsOptional()
  program_types?: PkgProgram[];

  @ApiPropertyOptional({ enum: PkgTrack, isArray: true, example: [PkgTrack.preliminary] })
  @IsEnum(PkgTrack, { each: true })
  @IsArray()
  @IsOptional()
  tracks?: PkgTrack[];

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  requires_purchase?: boolean;

  @ApiPropertyOptional({ type: [String], example: ['pkg-uuid-1'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  package_ids?: string[];

  @ApiPropertyOptional({ 
    type: () => [CreateSuggestionDto], 
    description: 'Nested sub-suggestions to create recursively',
    example: [{
      title: 'Sub-Topic: Fundamental Rights',
      content: 'Content of the sub-suggestion...',
      category: 'General',
      is_active: true
    }]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSuggestionDto)
  @IsOptional()
  children?: CreateSuggestionDto[];
}