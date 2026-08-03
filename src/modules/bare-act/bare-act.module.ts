import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BareActService } from './bare-act.service';
import { BareActUserController } from './controllers/bare-act-user.controller';
import { BareActAdminController } from './controllers/bare-act-admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FILE_UPLOAD_QUEUES } from '../file-upload/constants/file-upload.constants';

@Module({
  
  controllers: [BareActUserController, BareActAdminController],
  providers: [BareActService],
  exports: [BareActService],
})
export class BareActModule {}