import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteUserController } from './controllers/note-user.controller';
import { NoteAdminController } from './controllers/note-admin.controller';

@Module({
  controllers: [NoteUserController, NoteAdminController],
  providers: [NoteService],
})
export class NoteModule {}
