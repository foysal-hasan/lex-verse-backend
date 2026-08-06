import { Controller, Get, Param, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookReferenceService } from '../book-reference.service';
import { QueryBookReferenceDto } from '../dto/query-book-reference.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { BOOK_REFERENCE_CONFIG } from '../config/book-reference.config';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('User - Book References')
@Controller('book-references')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class BookReferenceUserController {
  constructor(private readonly bookReferenceService: BookReferenceService) {}

  @Get()
  @ApiOperation({ summary: 'List book references by package ID (purchase check enforced if configured)' })
  async findAll(@Query() query: QueryBookReferenceDto, @Req() req: Request) {
    const userId = req.user.userId;
    return this.bookReferenceService.findAll(query, userId, false);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single published book reference detail' })
  async findOne(
    @Param('id') id: string,
    @Query('package_id') packageId: string,
    @Req() req: Request,
  ) {
    const userId = req.user.userId;
    return this.bookReferenceService.findOne(id, userId, packageId, false);
  }
}