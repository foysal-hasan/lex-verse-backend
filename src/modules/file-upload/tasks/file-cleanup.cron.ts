import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileCleanupCronService {
  private readonly logger = new Logger(FileCleanupCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Runs automatically every hour
  @Cron(CronExpression.EVERY_HOUR)
  async handleUnusedFilesCleanup() {
    this.logger.log('Executing 12-hour orphan file cleanup scan...');

    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    try {
      // 1. Fetch only PENDING files uploaded > 12 hours ago (O(1) Indexed Query)
      const orphanFiles = await this.prisma.fileUpload.findMany({
        where: {
          status: 'PENDING',
          created_at: { lt: twelveHoursAgo },
        },
        select: { id: true, file_path: true },
        take: 500, // Batch limit per cycle
      });

      if (orphanFiles.length === 0) {
        this.logger.log('No 12-hour old orphan files found.');
        return;
      }

      const deletedIds: string[] = [];

      for (const fileRecord of orphanFiles) {
        const absolutePath = path.join(process.cwd(), fileRecord.file_path);

        // Remove from physical disk/storage
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }

        deletedIds.push(fileRecord.id);
      }

      // 2. Clear deleted records from database
      await this.prisma.fileUpload.deleteMany({
        where: { id: { in: deletedIds } },
      });

      this.logger.log(`Cleaned up ${deletedIds.length} unused orphan file(s).`);
    } catch (error) {
      this.logger.error('Error executing file cleanup job:', error);
    }
  }
}