import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SyllabusService } from '../syllabus.service';
import { CreateSyllabusDto } from '../dto/create-syllabus.dto';
import { UpdateSyllabusDto } from '../dto/update-syllabus.dto';
import { QuerySyllabusDto } from '../dto/query-syllabus.dto';
import { ManageSyllabusPackagesDto } from '../dto/manage-syllabus-packages.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('Admin - Syllabuses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/syllabuses')
export class SyllabusAdminController {
  constructor(private readonly syllabusService: SyllabusService) {}

  @Post()
  @ApiOperation({ summary: 'Create syllabus (Admin)' })
  create(@Body() dto: CreateSyllabusDto) {
    return this.syllabusService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List syllabuses with filter, search, sort, and pagination (Admin)' })
  findAll(@Query() query: QuerySyllabusDto) {
    return this.syllabusService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single syllabus details (Admin)' })
  findOne(@Param('id') id: string) {
    return this.syllabusService.findOneAdmin(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update syllabus (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateSyllabusDto) {
    return this.syllabusService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete syllabus (Admin)' })
  remove(@Param('id') id: string) {
    return this.syllabusService.remove(id);
  }

  @Post(':id/packages/attach')
  @ApiOperation({ summary: 'Attach packages to a syllabus (Admin)' })
  attachPackages(@Param('id') id: string, @Body() dto: ManageSyllabusPackagesDto) {
    return this.syllabusService.attachPackages(id, dto.package_ids);
  }

  @Post(':id/packages/detach')
  @ApiOperation({ summary: 'Detach packages from a syllabus (Admin)' })
  detachPackages(@Param('id') id: string, @Body() dto: ManageSyllabusPackagesDto) {
    return this.syllabusService.detachPackages(id, dto.package_ids);
  }
}