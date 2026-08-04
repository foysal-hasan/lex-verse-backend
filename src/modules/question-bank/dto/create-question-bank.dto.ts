import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Tier } from 'src/generated/prisma/enums';


export class CreateQuestionBankDto {
  @ApiProperty({ example: 'Bar Council Preliminary 2023 Solved Paper' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Complete question bank with detailed explanations' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: ['Bar Council', 'Preliminary', '2023'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = [];

  @ApiProperty({ example: 'uploads/question-banks/2023-prelim.pdf' })
  @IsString()
  @IsNotEmpty()
  pdf_path: string;

  @ApiPropertyOptional({ example: 'https://cdn.domain.com/uploads/question-banks/2023-prelim.pdf' })
  @IsString()
  @IsOptional()
  pdf_url?: string;

  @ApiPropertyOptional({ example: 'question_answer' })
  @IsString()
  @IsOptional()
  content_type?: string = 'question_answer';

  @ApiProperty({ example: 'LLB' })
  @IsString()
  @IsNotEmpty()
  program_type: string;

  @ApiProperty({ example: 'Bar Council' })
  @IsString()
  @IsNotEmpty()
  exam_type: string;

  @ApiPropertyOptional({ enum: Tier, default: Tier.free })
  @IsEnum(Tier)
  @IsOptional()
  tier?: Tier = Tier.free;

  @ApiPropertyOptional({ example: 2023 })
  @IsInt()
  @Min(1900)
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({ example: 'Civil Procedure Code' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  allow_download?: boolean = true;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 350 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount_price?: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  is_published?: boolean = true;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  is_featured?: boolean = false;

  @ApiPropertyOptional({ example: 'uuid-of-package' })
  @IsString()
  @IsOptional()
  package_id?: string;
}