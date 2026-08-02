import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateLegalDictionaryDto {
  @ApiProperty({ example: 'Affidavit' })
  @IsString()
  term_en: string;

  @ApiPropertyOptional({ example: 'অ্যাফিডেভিট / হলফনামা' })
  @IsString()
  @IsOptional()
  term_bn?: string;

  @ApiPropertyOptional({ example: 'A written statement confirmed by oath or affirmation.' })
  @IsString()
  @IsOptional()
  definition_en?: string;

  @ApiPropertyOptional({ example: 'শপথ বা প্রত্যয়ন দ্বারা সমর্থিত একটি লিখিত বিবৃতি।' })
  @IsString()
  @IsOptional()
  definition_bn?: string;

  @ApiPropertyOptional({ example: 'Criminal Law' })
  @IsString()
  @IsOptional()
  category?: string;
}