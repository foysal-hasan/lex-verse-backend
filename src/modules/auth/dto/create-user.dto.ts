import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

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
    description: 'User password',
    example: 'MySecurePass123',
    minLength: 8,
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @MinLength(8, { message: 'Password should be minimum 8 characters.' })
  password: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+8801334567891',
    format: 'phone',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: 'User university name',
    example: 'Dhaka University',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  university: string;

  @ApiProperty({
    description: 'User profession',
    example: 'Student',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  profession: string;

  @ApiProperty({
    description: 'User gender',
    example: 'Male',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  gender: string;


}