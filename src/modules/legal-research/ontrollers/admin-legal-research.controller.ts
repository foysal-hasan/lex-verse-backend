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
import { LegalResearchService } from '../legal-research.service';
import { CreateLegalResearchDto } from '../dto/create-legal-research.dto';
import { UpdateLegalResearchDto } from '../dto/update-legal-research.dto';
import { FilterLegalResearchDto } from '../dto/filter-legal-research.dto';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { UserRole } from 'src/generated/prisma/enums';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('Legal Research (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/legal-research')
export class AdminLegalResearchController {
  constructor(private readonly legalResearchService: LegalResearchService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new legal research entry (Admin)' })
  @ApiResponse({ status: 201, description: 'Research successfully created.' })
  create(@Body() dto: CreateLegalResearchDto) {
    return this.legalResearchService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all legal research entries with filtering, tag matching, sorting, and pagination (Admin)' })
  @ApiResponse({ status: 200, description: 'List of researches returned successfully.' })
  findAll(@Query() filters: FilterLegalResearchDto) {
    return this.legalResearchService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get legal research entry by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Research entry found successfully.' })
  @ApiResponse({ status: 404, description: 'Research entry not found.' })
  findOne(@Param('id') id: string) {
    return this.legalResearchService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update legal research entry (Admin)' })
  @ApiResponse({ status: 200, description: 'Research entry updated successfully.' })
  update(@Param('id') id: string, @Body() dto: UpdateLegalResearchDto) {
    return this.legalResearchService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete legal research entry (Admin)' })
  @ApiResponse({ status: 200, description: 'Research entry deleted successfully.' })
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id;
    return this.legalResearchService.remove(id, userId);
  }
}