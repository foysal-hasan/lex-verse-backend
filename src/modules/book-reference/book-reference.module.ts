import { Module } from '@nestjs/common';
import { BookReferenceService } from './book-reference.service';
import { BookReferenceUserController } from './controllers/book-reference-user.controller';
import { BookReferenceAdminController } from './controllers/book-reference-admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BookReferenceUserController, BookReferenceAdminController],
  providers: [BookReferenceService],
  exports: [BookReferenceService],
})
export class BookReferenceModule {}