import {
    IsString,
    IsOptional,
    IsUUID,
    IsDateString,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class PackageWrittenExamMappingDto {
    @ApiProperty({
        description: 'The unique identifier of the package',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    package_id: string;

    @ApiProperty({
        description: 'The title/name of the written exam specific to this package',
        example: 'Midterm Exam - Batch A'
    })
    @IsString()
    title: string;

    @ApiPropertyOptional({
        description: 'Optional routine identifier associated with this exam schedule',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsOptional()
    @IsUUID()
    routine_id?: string;

    @ApiProperty({
        description: 'The start date and time for the exam in this package',
        example: '2026-08-20T10:00:00.000Z'
    })
    @IsDateString()
    start_datetime: string;

    @ApiProperty({
        description: 'The end date and time for the exam in this package',
        example: '2026-08-20T13:00:00.000Z'
    })
    @IsDateString()
    end_datetime: string;
}