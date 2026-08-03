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
import { UserRole } from 'src/generated/prisma/enums';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CaseReferenceService } from '../case-reference.service';
import { CreateCaseReferenceDto } from '../dto/create-case-reference.dto';
import { QueryCaseReferenceDto } from '../dto/query-case-reference.dto';
import { UpdateCaseReferenceDto } from '../dto/update-case-reference.dto';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';


@ApiTags('Admin - Case References')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/case-references')
export class CaseReferenceAdminController {
  constructor(private readonly caseReferenceService: CaseReferenceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Case Reference' })
  async create(@Body() createDto: CreateCaseReferenceDto) {
    return this.caseReferenceService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all Case References including unpublished ones' })
  async findAll(@Query() query: QueryCaseReferenceDto) {
    return this.caseReferenceService.findAll(query, true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Case Reference by ID (Admin)' })
  async findOne(@Param('id') id: string) {
    return this.caseReferenceService.findOne(id, true);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Case Reference' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCaseReferenceDto,
  ) {
    return this.caseReferenceService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete Case Reference' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const adminUserId = req.user?.id || 'system_admin';
    return this.caseReferenceService.remove(id, adminUserId);
  }
}