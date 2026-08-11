import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password', 'email'] as const)) {

  @ApiPropertyOptional({
    description: 'User profile image',
    type: 'string',
    format: 'binary',
  })
  image?: File;

  avatar?: string;


  // for system users
  @ApiPropertyOptional({ example: 'Co-Founder & CEO' })
  @IsString()
  @IsOptional()
  designation?: string;

  @ApiPropertyOptional({ example: 'Advocate · LL.B & LL.M, Islamic University, Kushtia' })
  @IsString()
  @IsOptional()
  credential?: string;

  @ApiPropertyOptional({ example: 'Detailed text content of the user...' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://www.facebook.com/abc' })
  @IsString()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://twitter.com/abc' })
  @IsString()
  @IsOptional()
  twitter?: string;
  
  @ApiPropertyOptional({ example: 'https://www.instagram.com/abc' })
  @IsString()
  @IsOptional()
  instagram?: string;


  @ApiPropertyOptional({ example: 'https://www.linkedin.com/in/abc' })
  @IsString()
  @IsOptional()
  linkedin?: string;
}
