import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WrittenExamService } from './written-exam.service';
import { CreateWrittenExamDto, UpdateWrittenExamDto } from './dto/create-written-exam.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { UserRole } from 'src/generated/prisma/enums';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { AdminGetWrittenExamsQueryDto } from './dto/admin-get-written-exams-query.dto';
import { AttachPackagesDto } from './dto/attach-packages.dto';
import { DetachPackagesDto } from './dto/detach-packages.dto';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';

@ApiTags('Admin - Written Exams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/written-exams/exam')
export class AdminWrittenExamController {
  constructor(private readonly writtenExamService: WrittenExamService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new written exam and map to packages' })
  async create(@Body() dto: CreateWrittenExamDto, @Req() req: Request) {
    const userId = req.user?.userId;
    dto.created_by = userId
    return await this.writtenExamService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all written exams with pagination, search, and filters' })
  async findAll(@Query() query: AdminGetWrittenExamsQueryDto) {
    return await this.writtenExamService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single written exam by ID' })
  async findOne(@Param('id') id: string) {
    return await this.writtenExamService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a written exam' })
  async update(@Param('id') id: string, @Body() dto: UpdateWrittenExamDto) {
    return await this.writtenExamService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a written exam' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.userId;
    return await this.writtenExamService.remove(id, userId);
  }

  @Post(':id/packages/attach')
  @ApiOperation({ summary: 'Attach packages and schedules to a written exam' })
  @ResponseMessage('Packages attached successfully')
  async attachPackages(
    @Param('id') id: string,
    @Body() dto: AttachPackagesDto,
  ) {
    return await this.writtenExamService.attachPackages(id, dto);
  }

  @Post(':id/packages/detach')
  @ApiOperation({ summary: 'Detach packages from a written exam' })
  @ResponseMessage('Packages detached successfully')
  async detachPackages(
    @Param('id') id: string,
    @Body() dto: DetachPackagesDto,
  ) {
    return await this.writtenExamService.detachPackages(id, dto.package_ids);
  }
}