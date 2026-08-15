import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotePurchaseStatus } from 'src/generated/prisma/enums';


export class UpdateNotePurchaseStatusDto {
  @ApiProperty({ enum: NotePurchaseStatus, example: NotePurchaseStatus.paid })
  @IsEnum(NotePurchaseStatus)
  @IsNotEmpty()
  status: NotePurchaseStatus;

  @ApiPropertyOptional({ example: 'Verified transaction manually via merchant account.' })
  @IsString()
  @IsOptional()
  reviewed_note?: string;
}