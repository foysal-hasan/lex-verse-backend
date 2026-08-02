import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { UserQuizController } from './controllers/user-quiz.controller';
import { AdminQuizController } from './controllers/admin-quiz.controller';


@Module({
  controllers: [UserQuizController, AdminQuizController],
  providers: [QuizService],
})
export class QuizModule {}
