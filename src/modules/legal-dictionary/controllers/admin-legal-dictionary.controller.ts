import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards,
  UseInterceptors,
  Req
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LegalDictionaryService } from '../legal-dictionary.service';
import { CreateLegalDictionaryDto } from '../dto/create-legal-dictionary.dto';
import { UpdateLegalDictionaryDto } from '../dto/update-legal-dictionary.dto';
import { FilterLegalDictionaryDto } from '../dto/filter-legal-dictionary.dto';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { UserRole } from 'src/generated/prisma/enums';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('Legal Dictionary (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/legal-dictionary')
export class AdminLegalDictionaryController {
  constructor(private readonly legalDictionaryService: LegalDictionaryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new legal dictionary entry (Admin)' })
  @ApiResponse({ status: 201, description: 'Entry successfully created.' })
  create(@Body() dto: CreateLegalDictionaryDto) {
    return this.legalDictionaryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all legal dictionary entries with filter, sort, and pagination (Admin)' })
  @ApiResponse({ status: 200, description: 'Filtered list returned successfully.' })
  findAll(@Query() filters: FilterLegalDictionaryDto) {
    return this.legalDictionaryService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get legal dictionary entry by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Entry found successfully.' })
  @ApiResponse({ status: 404, description: 'Entry not found.' })
  findOne(@Param('id') id: string) {
    return this.legalDictionaryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update legal dictionary entry (Admin)' })
  @ApiResponse({ status: 200, description: 'Entry updated successfully.' })
  update(@Param('id') id: string, @Body() dto: UpdateLegalDictionaryDto) {
    return this.legalDictionaryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete legal dictionary entry (Admin)' })
  @ApiResponse({ status: 200, description: 'Entry deleted successfully.' })
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id;
    return this.legalDictionaryService.remove(id, userId);
  }
}