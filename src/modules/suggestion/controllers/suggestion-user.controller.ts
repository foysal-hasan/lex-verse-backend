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
import { SuggestionService } from '../suggestion.service';
import { QuerySuggestionDto } from '../dto/query-suggestion.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('User - Suggestions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('suggestions')
@UseInterceptors(TransformResponseInterceptor)
export class SuggestionUserController {
  constructor(private readonly suggestionService: SuggestionService) {}

  @Get()
  @ApiOperation({ summary: 'View list of suggestion titles without content (User)' })
  findAllForUser(@Query() query: QuerySuggestionDto, @Req() req: Request) {
    const userId = req.user.userId;
    return this.suggestionService.findAllForUser(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'View full suggestion content with purchase access security check (User)' })
  findOneForUser(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user.userId;
    return this.suggestionService.findOneForUser(id, userId);
  }
}