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
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { RolesGuard } from 'src/common/guard/role/roles.guard';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { BareActService } from '../bare-act.service';
import { CreateBareActDto } from '../dto/create-bare-act.dto';
import { QueryBareActDto } from '../dto/query-bare-act.dto';
import { UpdateBareActDto } from '../dto/update-bare-act.dto';
import { UserRole } from 'src/generated/prisma/enums';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';


@ApiTags('Admin - Bare Acts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/bare-acts')
export class BareActAdminController {
  constructor(private readonly bareActService: BareActService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Bare Act' })
  async create(@Body() createBareActDto: CreateBareActDto) {
    return this.bareActService.create(createBareActDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all Bare Acts including inactive ones' })
  async findAll(@Query() query: QueryBareActDto) {
    return this.bareActService.findAll(query, true);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List unique categories of Bare Acts' })
  async getCategories() {
    return this.bareActService.getUniqueCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Bare Act details (including inactive ones)' })
  async findOne(@Param('id') id: string) {
    return this.bareActService.findOne(id, true);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Bare Act' })
  async update(
    @Param('id') id: string,
    @Body() updateBareActDto: UpdateBareActDto,
  ) {
    return this.bareActService.update(id, updateBareActDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a Bare Act' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const adminUserId = req.user?.id || 'system_admin';
    return this.bareActService.remove(id);
  }
}