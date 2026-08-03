import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AllowedUploadFolders } from '../strategies/allowed-folders.strategy';

export class UploadFileDto {
  @ApiProperty({
    enum: AllowedUploadFolders,
    example: AllowedUploadFolders.LEGAL_RESEARCH,
    description: 'Target folder destination for the uploaded file',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(AllowedUploadFolders, {
    message: `folder must be one of: ${Object.values(AllowedUploadFolders).join(', ')}`,
  })
  folder: AllowedUploadFolders;
}