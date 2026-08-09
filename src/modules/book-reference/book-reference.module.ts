import { Module } from '@nestjs/common';
import { BookReferenceService } from './book-reference.service';
import { BookReferenceUserController } from './controllers/book-reference-user.controller';
import { BookReferenceAdminController } from './controllers/book-reference-admin.controller';
import { PackageAccessCronService } from './package-access-cron.service';


@Module({
  controllers: [BookReferenceUserController, BookReferenceAdminController],
  providers: [BookReferenceService,PackageAccessCronService],
})
export class BookReferenceModule {}
