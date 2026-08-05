import { Module } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { FlashcardUserController } from './controllers/flashcard-user.controller';
import { FlashcardAdminController } from './controllers/flashcard-admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FlashcardUserController, FlashcardAdminController],
  providers: [FlashcardService],
  exports: [FlashcardService],
})
export class FlashcardModule {}