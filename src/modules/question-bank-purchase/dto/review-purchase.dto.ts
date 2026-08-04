import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum PurchaseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class ReviewQuestionBankPurchaseDto {
  @ApiProperty({ enum: PurchaseStatus, example: PurchaseStatus.APPROVED })
  @IsEnum(PurchaseStatus)
  @IsNotEmpty()
  status: PurchaseStatus;

  @ApiPropertyOptional({ example: 'Payment verified via bKash TRX.' })
  @IsString()
  @IsOptional()
  admin_note?: string;
}