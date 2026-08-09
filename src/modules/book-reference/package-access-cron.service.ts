import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PkgAccStatus } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PackageAccessCronService {
  private readonly logger = new Logger(PackageAccessCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Runs every hour at the top of the hour. 
  // You can change this to CronExpression.EVERY_DAY_AT_MIDNIGHT if preferred.
  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiredPackageAccesses() {
    this.logger.log('Running background job: Checking for expired package accesses...');

    try {
      const now = new Date();

      // Update all active user accesses whose expiration date has passed
      const result = await this.prisma.userPackageAccess.updateMany({
        where: {
          status: PkgAccStatus.active,
          expires_at: {
            lte: now, // Less than or equal to current timestamp
          },
        },
        data: {
          status: PkgAccStatus.expired,
        },
      });

      if (result.count > 0) {
        this.logger.log(`Successfully updated ${result.count} expired user package accesses to 'expired'.`);
      } else {
        this.logger.log('No expired package accesses found.');
      }
    } catch (error) {
      this.logger.error('Failed to update expired package accesses:', error);
    }
  }
}