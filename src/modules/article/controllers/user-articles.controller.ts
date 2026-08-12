import { Controller, Get, Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ArticlesService } from '../article.service';
import { QueryArticleDto } from '../dto/query.article.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import appConfig from 'src/config/app.config';
import { Storage } from 'src/common/lib/Disk/Storage';

@Controller('articles')
@UseInterceptors(TransformResponseInterceptor)
export class UserArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(@Query() query: QueryArticleDto) {
    const response = await this.articlesService.findAllPublishedForUser(query);
    response?.items?.forEach(item => {
      if(item?.author?.avatar_url){
        const key = `${appConfig().storageUrl.avatar}${item.author.avatar_url}`;
        item.author.avatar_url = Storage.url(key);
      }
      if(item?.banner_image) item.banner_image = Storage.url(item.banner_image);
      if(item?.cover_image) item.cover_image = Storage.url(item.cover_image);
    })
    return response;
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