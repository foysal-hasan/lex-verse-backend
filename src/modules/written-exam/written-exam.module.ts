import { Module } from '@nestjs/common';
import { AdminWrittenExamController } from './controllers/admin/admin-written-exam.controller';
import { UserWrittenExamController } from './controllers/user/user-written-exam.controller';
import { WrittenExamService } from './services/written-exam.service';
import { WrittenExamQuestionService } from './question/question.service';
import { QuestionSetService } from './services/question-set.service';
import { AdminQuestionController } from './question/admin-question.controller';
import { AdminQuestionSetController } from './controllers/admin/admin-question-set.controller';

@Module({
  controllers: [
    AdminWrittenExamController,
    AdminQuestionController,
    AdminQuestionSetController,
    UserWrittenExamController,
  ],
  providers: [
    WrittenExamService,
    WrittenExamQuestionService,
    QuestionSetService,
  ],
  exports: [WrittenExamService],
})
export class WrittenExamModule {}