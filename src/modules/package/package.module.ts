import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { AdminPackageController } from './controllers/admin-package.controller';
import { UserPackageController } from './controllers/user-package.controller';



@Module({
  controllers: [AdminPackageController, UserPackageController],
  providers: [PackageService],
})
export class PackageModule {}
