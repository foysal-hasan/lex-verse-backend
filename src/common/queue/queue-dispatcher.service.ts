import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, JobsOptions } from 'bullmq';
import { FILE_UPLOAD_QUEUES } from 'src/modules/file-upload/constants/file-upload.constants';

@Injectable()
export class QueueDispatcherService {
  constructor(
    @InjectQueue(FILE_UPLOAD_QUEUES.FILE_ATTACHMENT)
    private readonly fileAttachmentQueue: Queue,
  ) {}

  /**
   * Enqueue job to File Attachment Queue
   */
  async enqueueFileAttachment<T = any>(
    jobName: string,
    data: T,
    opts?: JobsOptions,
  ) {
    return this.fileAttachmentQueue.add(jobName, data, opts);
  }

  /**
   * Generic dynamic queue dispatcher (if you add more queues later)
   */
  async enqueue(
    queue: Queue,
    jobName: string,
    data: any,
    opts?: JobsOptions,
  ) {
    return queue.add(jobName, data, opts);
  }
}