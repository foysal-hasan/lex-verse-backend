import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";

export class DetachPackagesDto {
  @ApiProperty({ type: [String], example: ['package-uuid-1', 'package-uuid-2'] })
  @IsArray()
  package_ids: string[];
}