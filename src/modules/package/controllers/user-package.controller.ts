import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PackageService } from '../package.service';
import { FilterPackageDto } from '../dto/filter-package.dto';

@ApiTags('Packages (User)')
@Controller('packages')
export class UserPackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active packages with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Filtered list of active packages returned successfully.' })
  findAllActive(@Query() filters: FilterPackageDto) {
    return this.packageService.findAllActive(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific package details by ID' })
  @ApiResponse({ status: 200, description: 'Package details found.' })
  @ApiResponse({ status: 404, description: 'Package not found.' })
  findOne(@Param('id') id: string) {
    return this.packageService.findOne(id);
  }
}