import { Module } from '@nestjs/common';
import { PackagePurchaseService } from './package-purchase.service';
import { PackagePurchaseUserController } from './controllers/package-purchase-user.controller';
import { PackagePurchaseAdminController } from './controllers/package-purchase-admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    PackagePurchaseUserController,
    PackagePurchaseAdminController,
  ],
  providers: [PackagePurchaseService],
  exports: [PackagePurchaseService],
})
export class PackagePurchaseModule {}