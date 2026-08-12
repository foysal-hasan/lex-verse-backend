import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { NotePurchaseStatus } from 'src/generated/prisma/enums';


export class QueryNotePurchaseDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ enum: NotePurchaseStatus })
  @IsEnum(NotePurchaseStatus)
  @IsOptional()
  status?: NotePurchaseStatus;

  @ApiPropertyOptional({ description: 'Filter by user ID (Admin only)' })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({ description: 'Search by transaction ID or note title' })
  @IsString()
  @IsOptional()
  search?: string;
}