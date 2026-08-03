import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { FILE_UPLOAD_QUEUES } from 'src/modules/file-upload/constants/file-upload.constants';
import { QueueDispatcherService } from './queue-dispatcher.service';

@Global()
@Module({
  imports: [
    // Register queues centrally HERE once
    BullModule.registerQueue({
      name: FILE_UPLOAD_QUEUES.FILE_ATTACHMENT,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
      },
    }),
  ],
  providers: [QueueDispatcherService],
  exports: [BullModule, QueueDispatcherService], // Export so all modules can use them
})
export class GlobalQueueModule {}