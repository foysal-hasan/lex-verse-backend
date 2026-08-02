import { Module } from '@nestjs/common';
import { LegalResearchService } from './legal-research.service';
import { UserLegalResearchController } from './ontrollers/user-legal-research.controller';
import { AdminLegalResearchController } from './ontrollers/admin-legal-research.controller';


@Module({
  controllers: [UserLegalResearchController, AdminLegalResearchController],
  providers: [LegalResearchService],
})
export class LegalResearchModule {}
