import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FlashcardService } from '../flashcard.service';
import { CreateDeckDto } from '../dto/create-deck.dto';
import { UpdateDeckDto } from '../dto/update-deck.dto';
import { QueryDeckDto } from '../dto/query-deck.dto';
import { AddCardsDto, RemoveCardsDto } from '../dto/manage-cards.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { Request } from 'express';

@ApiTags('Admin - Flashcards & Decks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/flashcard-decks')
export class FlashcardAdminController {
  constructor(private readonly flashcardService: FlashcardService) {}

  @Get()
  @ApiOperation({ summary: 'List all flashcard decks including inactive' })
  async findAll(@Query() query: QueryDeckDto) {
    return this.flashcardService.findAllDecks(query, true);
  }

  // get all unique categories
  @Get('categories')
  @ApiOperation({ summary: 'Get list of unique categories' })
  async getCategories() {
    return this.flashcardService.getUniqueCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single deck detail including inactive cards' })
  async findOne(@Param('id') id: string) {
    return this.flashcardService.findOneDeck(id, true);
  }

  @Post()
  @ApiOperation({ summary: 'Create a deck with or without an array of cards (published or draft)' })
  async createDeck(@Body() dto: CreateDeckDto, @Req() req: Request) {
    const userId = req.user.userId;
    return this.flashcardService.createDeck(userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update deck metadata' })
  async updateDeck(@Param('id') id: string, @Body() dto: UpdateDeckDto) {
    return this.flashcardService.updateDeck(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a deck and its cards' })
  async removeDeck(@Param('id') id: string, @Req() req: Request) {
    const adminUserId = req.user.userId;
    return this.flashcardService.removeDeck(id, adminUserId);
  }

  // --- CARD ENDPOINTS ---

  @Post(':id/cards')
  @ApiOperation({ summary: 'Add one or many cards to an existing deck' })
  async addCards(@Param('id') deckId: string, @Body() dto: AddCardsDto) {
    return this.flashcardService.addCardsToDeck(deckId, dto);
  }

  @Patch('cards/:cardId')
  @ApiOperation({ summary: 'Update a single flashcard (e.g. toggle published/draft state or edit text)' })
  async updateCard(
    @Param('cardId') cardId: string,
    @Body() dto: UpdateCardDto,
  ) {
    return this.flashcardService.updateCard(cardId, dto);
  }

  @Post(':id/cards/remove')
  @ApiOperation({ summary: 'Remove one or many cards by passing an array of card IDs' })
  async removeCards(
    @Param('id') deckId: string,
    @Body() dto: RemoveCardsDto,
    @Req() req: Request,
  ) {
    const adminUserId = req.user.userId;
    return this.flashcardService.removeCardsFromDeck(deckId, dto, adminUserId);
  }
}