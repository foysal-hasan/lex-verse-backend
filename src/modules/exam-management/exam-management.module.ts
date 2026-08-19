import { Module } from '@nestjs/common';
import { AdminExamController } from './exam/admin-exam.controller';
import { UserExamController } from './exam/user-exam.controller';

import { ExamQuestionService } from './question/question.service';
import { QuestionSetService } from './question-set/question-set.service';
import { AdminQuestionController } from './question/admin-question.controller';
import { AdminQuestionSetController } from './question-set/admin-question-set.controller';
import { ExamService } from './exam/exam.service';

@Module({
  controllers: [
    AdminExamController,
    AdminQuestionController,
    AdminQuestionSetController,
    UserExamController,
  ],
  providers: [
    ExamService,
    ExamQuestionService,
    QuestionSetService,
  ],
  exports: [ExamService],
})
export class ExamManagementModule {}
