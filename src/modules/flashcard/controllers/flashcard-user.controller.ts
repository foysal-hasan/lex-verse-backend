import { Controller, Get, Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FlashcardService } from '../flashcard.service';
import { QueryDeckDto } from '../dto/query-deck.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('User - Flashcards & Decks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('flashcard-decks')
export class FlashcardUserController {
  constructor(private readonly flashcardService: FlashcardService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get list of unique categories' })
  async getCategories() {
    return this.flashcardService.getUniqueCategories();
  }

  @Get()
  @ApiOperation({ summary: 'List all active flashcard decks' })
  async findAll(@Query() query: QueryDeckDto) {
    return this.flashcardService.findAllDecks(query, false);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific deck with its cards' })
  async findOne(@Param('id') id: string) {
    return this.flashcardService.findOneDeck(id, false);
  }
}