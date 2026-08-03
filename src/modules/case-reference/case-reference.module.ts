import { Module } from '@nestjs/common';
import { CaseReferenceService } from './case-reference.service';
import { CaseReferenceUserController } from './controllers/case-reference-user.controller';
import { CaseReferenceAdminController } from './controllers/case-reference-admin.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CaseReferenceUserController, CaseReferenceAdminController],
  providers: [CaseReferenceService],
  exports: [CaseReferenceService],
})
export class CaseReferenceModule {}