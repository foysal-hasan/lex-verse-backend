import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoutineService } from '../routine.service';
import { CreateRoutineDto } from '../dto/create-routine.dto';
import { UpdateRoutineDto } from '../dto/update-routine.dto';
import { QueryRoutineAdminDto } from '../dto/query-routine-admin.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';
import { Storage } from 'src/common/lib/Disk/Storage';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('Admin - Routines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/routines')
export class RoutineAdminController {
  constructor(private readonly routineService: RoutineService) {}

  @Post()
  @ApiOperation({ summary: 'Create routine (Admin)' })
  async create(@Body() dto: CreateRoutineDto) {
    const routine = await this.routineService.create(dto);
    if (routine.file_path) {
      routine['file_url'] = Storage.url(routine.file_path);
    }
    return routine;
  }

  @Get()
  @ApiOperation({ summary: 'List routines with filters, search, and pagination (Admin)' })
  async findAll(@Query() query: QueryRoutineAdminDto) {
    const data = await this.routineService.findAllAdmin(query);
    data?.items?.forEach(item => {
      if (item.file_path) {
        item['file_url'] = Storage.url(item.file_path);
      }
    });
    return data;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single routine details (Admin)' })
  async findOne(@Param('id') id: string) {
    const routine = await this.routineService.findOneAdmin(id);
    if (routine.file_path) {
      routine['file_url'] = Storage.url(routine.file_path);
    }
    return routine;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update routine (Admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateRoutineDto) {
    const routine = await this.routineService.update(id, dto);
    if (routine.file_path) {
      routine['file_url'] = Storage.url(routine.file_path);
    }
    return routine;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete routine (Admin)' })
  remove(@Param('id') id: string) {
    return this.routineService.remove(id);
  }
}