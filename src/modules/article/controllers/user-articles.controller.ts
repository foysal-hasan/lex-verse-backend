import { Controller, Get, Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ArticlesService } from '../article.service';
import { QueryArticleDto } from '../dto/query.article.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@Controller('articles')
@UseInterceptors(TransformResponseInterceptor)
export class UserArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(@Query() query: QueryArticleDto) {
    return this.articlesService.findAllPublishedForUser(query);
  }

  @Get('tags')
  async getTags() {
    return this.articlesService.getAllTags();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.articlesService.findOneBySlugForUser(slug);
  }
}