import { Module } from '@nestjs/common';
import { AdminWrittenExamController } from './exam/admin-written-exam.controller';
import { UserWrittenExamController } from './exam/user-written-exam.controller';
import { WrittenExamService } from './exam/written-exam.service';
import { WrittenExamQuestionService } from './question/question.service';
import { QuestionSetService } from './question-set/question-set.service';
import { AdminQuestionController } from './question/admin-question.controller';
import { AdminQuestionSetController } from './question-set/admin-question-set.controller';

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