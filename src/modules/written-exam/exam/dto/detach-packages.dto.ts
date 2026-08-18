import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";

export class DetachPackagesDto {
  @ApiProperty({
    type: [String],
    description: 'List of package IDs to detach from the written exam',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  package_ids: string[];
}