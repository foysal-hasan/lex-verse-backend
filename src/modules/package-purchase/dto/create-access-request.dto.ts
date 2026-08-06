import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAccessRequestDto {
  @ApiProperty({ example: 'uuid-of-package' })
  @IsUUID()
  @IsNotEmpty()
  package_id: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+8801712345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'bKash' })
  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @ApiProperty({ example: 'TRX123456789' })
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @ApiPropertyOptional({ example: 'Paid via bKash personal account.' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiPropertyOptional({ example: 'client-unique-uuid-for-idempotency' })
  @IsString()
  @IsOptional()
  client_request_uuid?: string;
}