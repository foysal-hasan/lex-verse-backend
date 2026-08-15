import { Module } from '@nestjs/common';
import { SyllabusService } from './syllabus.service';
import { SyllabusUserController } from './controllers/syllabus-user.controller';
import { SyllabusAdminController } from './controllers/syllabus-admin.controller';


@Module({
  controllers: [SyllabusUserController, SyllabusAdminController],
  providers: [SyllabusService],
})
export class SyllabusModule {}
