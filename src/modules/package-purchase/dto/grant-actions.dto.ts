import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class ExtendGrantDto {
  @ApiProperty({ example: '2027-12-31T23:59:59Z', description: 'New expiration date' })
  @IsDateString()
  @IsNotEmpty()
  expires_at: string;
}

export class RevokeGrantDto {
  @ApiProperty({ example: 'Violation of terms of service or payment refund requested.' })
  @IsString()
  @IsNotEmpty()
  revoke_reason: string;
}