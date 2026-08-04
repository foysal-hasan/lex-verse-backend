import { Module } from '@nestjs/common';
import { QuestionBankPurchaseService } from './question-bank-purchase.service';
import { QuestionBankPurchaseUserController } from './controllers/question-bank-purchase-user.controller';
import { QuestionBankPurchaseAdminController } from './controllers/question-bank-purchase-admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    QuestionBankPurchaseUserController,
    QuestionBankPurchaseAdminController,
  ],
  providers: [QuestionBankPurchaseService],
  exports: [QuestionBankPurchaseService],
})
export class QuestionBankPurchaseModule {}