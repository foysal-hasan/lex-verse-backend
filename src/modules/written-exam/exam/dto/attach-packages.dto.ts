import { ApiProperty } from "@nestjs/swagger";
import { PackageWrittenExamMappingDto } from "./package-written-exam-mapping.dto";
import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class AttachPackagesDto {
  @ApiProperty({
    type: [PackageWrittenExamMappingDto],
    description: 'List of package schedules to attach to the written exam',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageWrittenExamMappingDto)
  packages: PackageWrittenExamMappingDto[];
}