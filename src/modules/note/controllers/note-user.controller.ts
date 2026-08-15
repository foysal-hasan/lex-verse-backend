import { Controller, Get, Param, Query, UseGuards, Req, UseInterceptors, StreamableFile } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoteService } from '../note.service';
import { QueryNoteDto } from '../dto/query-note.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { Storage } from 'src/common/lib/Disk/Storage';
import * as path from 'path';

@ApiTags('User - Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
@UseInterceptors(TransformResponseInterceptor)
export class NoteUserController {
    constructor(private readonly noteService: NoteService) { }

    @Get()
    @ApiOperation({ summary: 'Get all notes with is_locked status flag (User)' })
    findAllForUser(@Query() query: QueryNoteDto, @Req() req: Request) {
        const userId = req.user.userId;
        return this.noteService.findAllForUser(userId, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get single note content with purchase check (User)' })
    findOneForUser(@Param('id') id: string, @Req() req: Request) {
        const userId = req.user.userId;
        return this.noteService.findOneForUser(id, userId);
    }

    @Get(':id/download')
    @ApiOperation({ summary: 'Secure file download endpoint for notes (User)' })
    async downloadNote(@Param('id') id: string, @Req() req: Request) {
        const userId = req.user.userId;
        const response = await this.noteService.downloadNoteFile(id, userId);

        const fileStream = await Storage.getStream(response.file_path);
        const ext = path.extname(response.file_path);

        return new StreamableFile(fileStream, {
            disposition: `attachment; filename="${encodeURIComponent(response.title)}${ext}`,
        });
    }
}