import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookReferenceService } from '../book-reference.service';
import { QueryBookReferenceDto } from '../dto/query-book-reference.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('User - Book References')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('book-references')
export class BookReferenceUserController {
  constructor(private readonly bookReferenceService: BookReferenceService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch book references by mandatory package ID with purchase validation (User)' })
  findAllForUser(@Query() query: QueryBookReferenceDto, @Req() req: Request) {
    const userId = req.user.userId;
    return this.bookReferenceService.findAllForUser(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single book reference with strict purchase security (User)' })
  findOneForUser(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user.userId;
    return this.bookReferenceService.findOneForUser(id, userId);
  }
}