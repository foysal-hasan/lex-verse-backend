import { Module } from '@nestjs/common';
import { AdminExamController } from './exam/admin-exam.controller';

import { QuestionService } from './question/question.service';
import { QuestionSetService } from './question-set/question-set.service';
import { AdminQuestionController } from './question/admin-question.controller';
import { AdminQuestionSetController } from './question-set/admin-question-set.controller';
import { ExamService } from './exam/exam.service';
import { BullModule } from '@nestjs/bullmq';
import { ExamSubmissionController } from './exam/exam-submission.controller';
import { ExamSubmissionService } from './exam/exam-submission.service';
import { ExamTimeoutProcessor } from './exam/exam-timeout.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'exam-timeout-queue',
    }),
  ],
  controllers: [
    AdminExamController,
    AdminQuestionController,
    AdminQuestionSetController,
    ExamSubmissionController,
  ],
  providers: [
    ExamService,
    QuestionService,
    QuestionSetService,
    ExamSubmissionService,
    ExamTimeoutProcessor,
  ],
  exports: [ExamService],
})
export class ExamManagementModule {}
