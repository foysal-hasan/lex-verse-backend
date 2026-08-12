import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotePurchaseDto {
  @ApiProperty({ example: 'note-uuid-here' })
  @IsString()
  @IsNotEmpty()
  note_id: string;

  @ApiProperty({ example: '01700000000' })
  @IsString()
  @IsNotEmpty()
  sender_phone: string;

  @ApiProperty({ example: 'TRX123456789' })
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @ApiProperty({ example: 'bKash' })
  @IsString()
  @IsNotEmpty()
  payment_method: string;
}