import { Controller, Post, Patch, Delete, Body, Param, UseGuards, Get, Query, Req, UseInterceptors } from '@nestjs/common';
import { ArticlesService } from '../article.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { UserRole } from 'src/generated/prisma/enums';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { QueryAdminArticleDto } from '../dto/query.article.dto';
import { Request } from 'express';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import appConfig from 'src/config/app.config';
import { Storage } from 'src/common/lib/Disk/Storage';


@ApiTags('Admin - Articles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/articles')
export class AdminArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article (Admin)' })
  async create(@Body() dto: CreateArticleDto) {
    const response = await this.articlesService.create(dto);
    if(response?.user?.avatar_url){
      const key = `${appConfig().storageUrl.avatar}${response.user.avatar_url}`;
      response.user.avatar_url = Storage.url(key);
    }

    if(response?.banner_image) response.banner_image = Storage.url(response.banner_image);
    if(response?.cover_image) response.cover_image = Storage.url(response.cover_image);

    return response;
  }

  @Get()
  @ApiOperation({ summary: 'View list of all articles (Admin)' })
  findAll(@Query() query: QueryAdminArticleDto) {
    return this.articlesService.findAllForAdmin(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an article (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an article (Admin)' })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}