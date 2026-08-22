import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PackageScheduleDto {
    @ApiProperty({ example: '2d4ef141-eb07-40b4-9002-66ed1e3608c4', description: 'Package UUID' })
    @IsString()
    @IsNotEmpty()
    package_id: string;

    @ApiProperty({ example: 'Final Mock Exam Schedule Title', description: 'Schedule Title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({ example: '86d6d2b1-3c9e-4c39-bf6c-40842ec4feb4', description: 'Routine UUID' })
    @IsString()
    @IsOptional()
    routine_id?: string;

    @ApiProperty({
        example: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
        description: 'Start of the day (00:00:00.000Z)'
    })
    @IsNotEmpty()
    start_datetime: string;

    @ApiProperty({
        example: new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString(),
        description: 'End of the day (23:59:59.999Z)'
    })
    @IsNotEmpty()
    end_datetime: string;
}