import { Module } from '@nestjs/common';
import { LegalDictionaryService } from './legal-dictionary.service';
import { UserLegalDictionaryController } from './controllers/user-legal-dictionary.controller';
import { AdminLegalDictionaryController } from './controllers/admin-legal-dictionary.controller';



@Module({
  controllers: [UserLegalDictionaryController, AdminLegalDictionaryController], 
  providers: [LegalDictionaryService],
})
export class LegalDictionaryModule {}
