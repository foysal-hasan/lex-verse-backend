import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { FILE_UPLOAD_QUEUES, FILE_UPLOAD_JOBS } from '../constants/file-upload.constants';

export interface MarkAttachedJobData {
  urls: string[];
}

@Processor(FILE_UPLOAD_QUEUES.FILE_ATTACHMENT)
export class FileAttachmentProcessor extends WorkerHost {
  private readonly logger = new Logger(FileAttachmentProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<MarkAttachedJobData>): Promise<void> {
    switch (job.name) {
      case FILE_UPLOAD_JOBS.MARK_ATTACHED:
        await this.handleMarkAttached(job);
        break;

      case FILE_UPLOAD_JOBS.MARK_DETACHED:
        await this.handleMarkDetached(job);
        break;

      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handleMarkAttached(job: Job<MarkAttachedJobData>) {
    const { urls } = job.data;
    if (!urls || urls.length === 0) return;

    await this.prisma.fileUpload.updateMany({
      where: { url: { in: urls } },
      data: { status: 'ATTACHED' },
    });

    this.logger.log(`Job [${job.id}]: Marked ${urls.length} file(s) as ATTACHED.`);
  }

  private async handleMarkDetached(job: Job<MarkAttachedJobData>) {
    const { urls } = job.data;
    if (!urls || urls.length === 0) return;

    await this.prisma.fileUpload.updateMany({
      where: { url: { in: urls } },
      data: { status: 'PENDING' },
    });

    this.logger.log(`Job [${job.id}]: Reverted ${urls.length} file(s) to PENDING.`);
  }
}