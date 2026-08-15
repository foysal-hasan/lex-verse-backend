import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import appConfig from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bullmq';
import { PackageModule } from './modules/package/package.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { LegalDictionaryModule } from './modules/legal-dictionary/legal-dictionary.module';
import { LegalResearchModule } from './modules/legal-research/legal-research.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BareActModule } from './modules/bare-act/bare-act.module';
import { GlobalQueueModule } from './common/queue/global-queue.module';
import { CaseReferenceModule } from './modules/case-reference/case-reference.module';
import { QuestionBankModule } from './modules/question-bank/question-bank.module';
import { QuestionBankPurchaseModule } from './modules/question-bank-purchase/question-bank-purchase.module';
import { FlashcardModule } from './modules/flashcard/flashcard.module';
import { BookReferenceModule } from './modules/book-reference/book-reference.module';
import { PackagePurchaseModule } from './modules/package-purchase/package-purchase.module';
import { SuggestionModule } from './modules/suggestion/suggestion.module';
import { ArticleModule } from './modules/article/article.module';
import { NoteModule } from './modules/note/note.module';
import { NotePurchaseModule } from './modules/note-purchase/note-purchase.module';
import { SyllabusModule } from './modules/syllabus/syllabus.module';
import { RoutineModule } from './modules/routine/routine.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    BullModule.forRoot({
      connection: {
        host: appConfig().redis.host,
        password: appConfig().redis.password,
        port: +appConfig().redis.port,
      },
    }),
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: appConfig().redis.host,
        password: appConfig().redis.password,
        port: +appConfig().redis.port,
      },
    }),
    GlobalQueueModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    AuthModule,
    PackageModule,
    QuizModule,
    LegalDictionaryModule,
    LegalResearchModule,
    FileUploadModule,
    BareActModule,
    CaseReferenceModule,
    QuestionBankModule,
    QuestionBankPurchaseModule,
    FlashcardModule,
    BookReferenceModule,
    PackagePurchaseModule,
    SuggestionModule,
    ArticleModule,
    NoteModule,
    NotePurchaseModule,
    SyllabusModule,
    RoutineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
