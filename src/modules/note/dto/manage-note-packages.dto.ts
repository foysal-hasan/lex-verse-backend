import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ManageNotePackagesDto {
  @ApiProperty({ type: [String], example: ['pkg-uuid-1', 'pkg-uuid-2'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  package_ids: string[];
}