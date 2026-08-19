import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { UserRole } from 'src/generated/prisma/enums';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { AdminGetExamsQueryDto } from './dto/admin-get-exams-query.dto';
import { AttachPackagesDto } from './dto/attach-packages.dto';
import { DetachPackagesDto } from './dto/detach-packages.dto';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';
import { ExamService } from './exam.service';

@ApiTags('Admin - Exams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/exams')
export class AdminExamController {
  constructor(private readonly examService: ExamService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new exam and map to packages' })
  async create(@Body() dto: CreateExamDto, @Req() req: Request) {
    const userId = req.user?.userId;
    dto.created_by = userId
    return await this.examService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exams with pagination, search, and filters' })
  async findAll(@Query() query: AdminGetExamsQueryDto) {
    return await this.examService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single exam by ID' })
  async findOne(@Param('id') id: string) {
    return await this.examService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exam' })
  async update(@Param('id') id: string, @Body() dto: UpdateExamDto) {
    return await this.examService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an exam' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.userId;
    return await this.examService.remove(id, userId);
  }

  @Post(':id/packages/attach')
  @ApiOperation({ summary: 'Attach packages and schedules to an exam' })
  @ResponseMessage('Packages attached successfully')
  async attachPackages(
    @Param('id') id: string,
    @Body() dto: AttachPackagesDto,
  ) {
    return await this.examService.attachPackages(id, dto);
  }

  @Post(':id/packages/detach')
  @ApiOperation({ summary: 'Detach packages from an exam' })
  @ResponseMessage('Packages detached successfully')
  async detachPackages(
    @Param('id') id: string,
    @Body() dto: DetachPackagesDto,
  ) {
    return await this.examService.detachPackages(id, dto.package_ids);
  }
}
