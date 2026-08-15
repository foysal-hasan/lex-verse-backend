import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoteService } from '../note.service';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { QueryNoteDto } from '../dto/query-note.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ManageNotePackagesDto } from '../dto/manage-note-packages.dto';

@ApiTags('Admin - Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/notes')
export class NoteAdminController {
    constructor(private readonly noteService: NoteService) { }

    @Post()
    @ApiOperation({ summary: 'Create note (Admin)' })
    create(@Body() dto: CreateNoteDto) {
        return this.noteService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List notes with filters & pagination (Admin)' })
    findAll(@Query() query: QueryNoteDto) {
        return this.noteService.findAllAdmin(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get single note (Admin)' })
    findOne(@Param('id') id: string) {
        return this.noteService.findOneAdmin(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update note (Admin)' })
    update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
        return this.noteService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete note (Admin)' })
    remove(@Param('id') id: string) {
        return this.noteService.remove(id);
    }

    @Post(':id/packages/attach')
    @ApiOperation({ summary: 'Attach packages to a note (Admin)' })
    attachPackages(@Param('id') id: string, @Body() dto: ManageNotePackagesDto) {
        return this.noteService.attachPackages(id, dto.package_ids);
    }

    @Post(':id/packages/detach')
    @ApiOperation({ summary: 'Detach packages from a note (Admin)' })
    detachPackages(@Param('id') id: string, @Body() dto: ManageNotePackagesDto) {
        return this.noteService.detachPackages(id, dto.package_ids);
    }
}