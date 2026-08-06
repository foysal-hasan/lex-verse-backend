import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { PkgAccStatus, PkgReqStatus } from '@prisma/client';

export class ReviewAccessRequestDto {
  @ApiProperty({ enum: PkgReqStatus, example: PkgReqStatus.approved })
  @IsEnum(PkgReqStatus)
  @IsNotEmpty()
  status: PkgReqStatus;

  @ApiPropertyOptional({ example: 'Payment verified successfully.' })
  @IsString()
  @IsOptional()
  decision_note?: string;

  @ApiPropertyOptional({ example: '2027-08-06T12:00:00Z', description: 'Optional expiration date for granted access' })
  @IsDateString()
  @IsOptional()
  expires_at?: string;
}