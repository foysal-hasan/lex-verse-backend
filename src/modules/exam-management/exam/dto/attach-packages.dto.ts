import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PackageScheduleDto } from './package-schedule.dto';

export class AttachPackagesDto {
  @ApiProperty({ type: [PackageScheduleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageScheduleDto)
  packages: PackageScheduleDto[];
}