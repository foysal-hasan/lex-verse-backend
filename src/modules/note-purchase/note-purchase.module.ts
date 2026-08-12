import { Module } from '@nestjs/common';
import { NotePurchaseService } from './note-purchase.service';
import { NotePurchaseUserController } from './controllers/note-purchase-user.controller';
import { NotePurchaseAdminController } from './controllers/note-purchase-admin.controller';

@Module({
  controllers: [NotePurchaseAdminController, NotePurchaseUserController],
  providers: [NotePurchaseService],
})
export class NotePurchaseModule {}
