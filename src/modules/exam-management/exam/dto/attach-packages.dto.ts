import { ApiProperty } from "@nestjs/swagger";
import { PackageExamMappingDto } from "./package-exam-mapping.dto";
import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class AttachPackagesDto {
  @ApiProperty({
    type: [PackageExamMappingDto],
    description: 'List of package schedules to attach to the exam',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageExamMappingDto)
  packages: PackageExamMappingDto[];
}
