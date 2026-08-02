import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PackageService } from '../package.service';
import { CreatePackageDto } from '../dto/create-package.dto';
import { UpdatePackageDto } from '../dto/update-package.dto';
import { FilterPackageDto } from '../dto/filter-package.dto';

@ApiTags('Packages (Admin)')
@ApiBearerAuth()
@Controller('admin/packages')
export class AdminPackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new package (Admin)' })
  @ApiResponse({ status: 201, description: 'Package successfully created.' })
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all packages with filtering, status toggle, and pagination (Admin)' })
  @ApiResponse({ status: 200, description: 'Full filtered list of packages.' })
  findAll(@Query() filters: FilterPackageDto) {
    return this.packageService.findAllAdmin(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get package by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Package found.' })
  findOne(@Param('id') id: string) {
    return this.packageService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing package (Admin)' })
  @ApiResponse({ status: 200, description: 'Package successfully updated.' })
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.update(id, updatePackageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a package (Admin)' })
  @ApiResponse({ status: 200, description: 'Package successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.packageService.remove(id);
  }
}