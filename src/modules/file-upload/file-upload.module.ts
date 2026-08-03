import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { AllowedFoldersStrategy } from './strategies/allowed-folders.strategy';
import { FileAttachmentProcessor } from './processors/file-attachment.processor';
import { FileCleanupCronService } from './tasks/file-cleanup.cron';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FILE_UPLOAD_QUEUES } from './constants/file-upload.constants';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: FILE_UPLOAD_QUEUES.FILE_ATTACHMENT,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
      },
    }),
  ],
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    AllowedFoldersStrategy,
    FileAttachmentProcessor,
    FileCleanupCronService,
  ],
  exports: [FileUploadService, BullModule],
})
export class FileUploadModule {}