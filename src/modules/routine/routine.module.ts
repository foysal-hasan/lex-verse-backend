import { Module } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { RoutineAdminController } from './controllers/routine-admin.controller';
import { RoutineUserController } from './controllers/routine-user.controller';

@Module({
  controllers: [RoutineAdminController, RoutineUserController],
  providers: [RoutineService],
})
export class RoutineModule {}
