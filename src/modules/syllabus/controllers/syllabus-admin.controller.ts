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
import { Storage } from 'src/common/lib/Disk/Storage';

@ApiTags('Admin - Syllabuses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/syllabuses')
export class SyllabusAdminController {
    constructor(private readonly syllabusService: SyllabusService) { }

    @Post()
    @ApiOperation({ summary: 'Create syllabus (Admin)' })
    async create(@Body() dto: CreateSyllabusDto) {
        const syllabus = await this.syllabusService.create(dto);
        if (syllabus?.file_path) {
            syllabus['file_url'] = Storage.url(syllabus.file_path);
        }

        return syllabus;
    }

    @Get()
    @ApiOperation({ summary: 'List syllabuses with filter, search, sort, and pagination (Admin)' })
    async findAll(@Query() query: QuerySyllabusDto) {
        const data = await this.syllabusService.findAllAdmin(query);
        data.items.forEach(item => {
            if (item?.file_path) {
                item['file_url'] = Storage.url(item.file_path);
            }
        })
        return data;
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get single syllabus details (Admin)' })
    async findOne(@Param('id') id: string) {
        const syllabus = await this.syllabusService.findOneAdmin(id);
        if (syllabus?.file_path) {   
            syllabus['file_url'] = Storage.url(syllabus.file_path);
        }
        return syllabus;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update syllabus (Admin)' })
    async update(@Param('id') id: string, @Body() dto: UpdateSyllabusDto) {
        const syllabus = await this.syllabusService.update(id, dto);
        if (syllabus?.file_path) {
            syllabus['file_url'] = Storage.url(syllabus.file_path);
        }
        return syllabus;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete syllabus (Admin)' })
    async remove(@Param('id') id: string) {
        return await this.syllabusService.remove(id);
    }

    @Post(':id/packages/attach')
    @ApiOperation({ summary: 'Attach packages to a syllabus (Admin)' })
    async attachPackages(@Param('id') id: string, @Body() dto: ManageSyllabusPackagesDto) {
        const syllabus = await this.syllabusService.attachPackages(id, dto.package_ids);
        if (syllabus?.file_path) {
            syllabus['file_url'] = Storage.url(syllabus.file_path);
        }
        return syllabus;
    }

    @Post(':id/packages/detach')
    @ApiOperation({ summary: 'Detach packages from a syllabus (Admin)' })
    async detachPackages(@Param('id') id: string, @Body() dto: ManageSyllabusPackagesDto) {
        const syllabus = await this.syllabusService.detachPackages(id, dto.package_ids);
        if (syllabus?.file_path) {
            syllabus['file_url'] = Storage.url(syllabus.file_path);
        }
        return syllabus;
    }
}