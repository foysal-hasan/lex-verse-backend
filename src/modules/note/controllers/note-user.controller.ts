import { Controller, Get, Param, Query, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoteService } from '../note.service';
import { QueryNoteDto } from '../dto/query-note.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('User - Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
@UseInterceptors(TransformResponseInterceptor)
export class NoteUserController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes with is_locked status flag (User)' })
  findAllForUser(@Query() query: QueryNoteDto, @Req() req: Request) {
    const userId = req.user.userId;
    return this.noteService.findAllForUser(userId, query);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Secure file download endpoint for notes (User)' })
  downloadNote(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.noteService.downloadNoteFile(id, userId);
  }
}