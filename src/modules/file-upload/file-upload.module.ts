import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { AllowedFoldersStrategy } from './strategies/allowed-folders.strategy';
import { FileAttachmentProcessor } from './processors/file-attachment.processor';
import { FileCleanupCronService } from './tasks/file-cleanup.cron';

@Module({
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    AllowedFoldersStrategy,
    FileAttachmentProcessor,
    FileCleanupCronService,
  ],
  exports: [FileUploadService],
})
export class FileUploadModule {}