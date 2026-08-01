import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsEmail()
  email: string;


  @ApiProperty({
    description: 'Verification token sent to the user email',
    example: '123456',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  token: string;
}
