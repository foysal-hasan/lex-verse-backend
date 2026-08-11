import { Module } from '@nestjs/common';
import { ArticlesService } from './article.service';
import { AdminArticlesController } from './controllers/admin-articles.controller';
import { UserArticlesController } from './controllers/user-articles.controller';

@Module({
  controllers: [AdminArticlesController, UserArticlesController],
  providers: [ArticlesService],
})
export class ArticleModule {}
