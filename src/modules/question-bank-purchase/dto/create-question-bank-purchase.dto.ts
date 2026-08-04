import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateQuestionBankPurchaseDto {
  @ApiProperty({ example: 'uuid-of-question-bank' })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  question_bank_id: string;

  @ApiPropertyOptional({ example: 'bkash' })
  @IsString()
  @IsOptional()
  payment_method?: string;

  @ApiPropertyOptional({ example: 'TRX123456789' })
  @IsString()
  @IsOptional()
  payment_reference?: string;
}