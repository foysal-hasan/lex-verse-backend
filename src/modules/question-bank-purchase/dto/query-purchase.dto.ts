import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PurchaseStatus } from './review-purchase.dto';

export class QueryQuestionBankPurchaseDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ enum: PurchaseStatus })
  @IsEnum(PurchaseStatus)
  @IsOptional()
  status?: PurchaseStatus;

  @ApiPropertyOptional({ description: 'Filter by specific user ID (Admin only)' })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({ description: 'Search payment reference or admin note' })
  @IsString()
  @IsOptional()
  search?: string;
}