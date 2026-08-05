import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { QueryDeckDto } from './dto/query-deck.dto';
import { AddCardsDto, RemoveCardsDto } from './dto/manage-cards.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class FlashcardService {
  constructor(private readonly prisma: PrismaService) {}

  // -------------------------------------------------------------
  // DECK MANAGEMENT
  // -------------------------------------------------------------
  async createDeck(userId: string, dto: CreateDeckDto) {
    const { cards, ...deckData } = dto;

    return this.prisma.flashcardDeck.create({
      data: {
        ...deckData,
        created_by: userId,
        flashcards: cards && cards.length > 0
          ? {
              create: cards.map((c, index) => ({
                front_text: c.front_text,
                back_text: c.back_text,
                front_image: c.front_image,
                back_image: c.back_image,
                order_index: c.order_index ?? index,
                is_active: c.is_active ?? true,
              })),
            }
          : undefined,
      },
      include: {
        flashcards: {
          where: { deleted_at: null },
          orderBy: { order_index: 'asc' },
        },
      },
    });
  }

  async findAllDecks(query: QueryDeckDto, isAdmin = false) {
    const { page = 1, limit = 10, search, category, is_active } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = { deleted_at: null };

    if (!isAdmin) {
      where.is_active = true;
    } else if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.flashcardDeck.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          _count: { select: { flashcards: true } },
        },
      }),
      this.prisma.flashcardDeck.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOneDeck(id: string, isAdmin = false) {
    const deck = await this.prisma.flashcardDeck.findFirst({
      where: { id, deleted_at: null },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        flashcards: {
          where: {
            deleted_at: null,
            ...(isAdmin ? {} : { is_active: true }), // Hide draft cards for regular users
          },
          orderBy: { order_index: 'asc' },
        },
      },
    });

    if (!deck) {
      throw new NotFoundException(`Flashcard deck '${id}' not found`);
    }

    if (!isAdmin && !deck.is_active) {
      throw new NotFoundException(`Flashcard deck '${id}' not found`);
    }

    return deck;
  }

  async updateDeck(id: string, dto: UpdateDeckDto) {
    await this.findOneDeck(id, true);

    const { cards, ...deckData } = dto;

    return this.prisma.flashcardDeck.update({
      where: { id },
      data: deckData,
      include: {
        flashcards: {
          where: { deleted_at: null },
          orderBy: { order_index: 'asc' },
        },
      },
    });
  }

  async removeDeck(id: string, adminUserId: string) {
    await this.findOneDeck(id, true);

    return this.prisma.$transaction(async (tx) => {
      // hard delete deck and cards in a transaction
      return await tx.flashcardDeck.delete({
        where: { id },
      });
    });
  }

  // -------------------------------------------------------------
  // CARD MANAGEMENT
  // -------------------------------------------------------------
  async addCardsToDeck(deckId: string, dto: AddCardsDto) {
    await this.findOneDeck(deckId, true);

    const createdCards = await this.prisma.$transaction(
      dto.cards.map((c, index) =>
        this.prisma.flashcard.create({
          data: {
            deck_id: deckId,
            front_text: c.front_text,
            back_text: c.back_text,
            front_image: c.front_image,
            back_image: c.back_image,
            order_index: c.order_index ?? index,
            is_active: c.is_active ?? true,
          },
        }),
      ),
    );

    return {
      message: `Successfully added ${createdCards.length} card(s)`,
      cards: createdCards,
    };
  }

  async updateCard(cardId: string, dto: UpdateCardDto) {
    const card = await this.prisma.flashcard.findFirst({
      where: { id: cardId, deleted_at: null },
    });

    if (!card) {
      throw new NotFoundException(`Flashcard '${cardId}' not found`);
    }

    return this.prisma.flashcard.update({
      where: { id: cardId },
      data: dto,
    });
  }

  async removeCardsFromDeck(deckId: string, dto: RemoveCardsDto, adminUserId: string) {
    await this.findOneDeck(deckId, true);

    const { count } = await this.prisma.flashcard.deleteMany({
      where: {
        id: { in: dto.card_ids}
      }
    })

    return {
      message: `Successfully removed ${count} card(s)`,
      count,
    };
  }

  // -------------------------------------------------------------
  // UTILS
  // -------------------------------------------------------------
  async getUniqueCategories(): Promise<string[]> {
    const res = await this.prisma.flashcardDeck.findMany({
      where: { deleted_at: null, category: { not: null } },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return res.map((r) => r.category).filter((c): c is string => Boolean(c));
  }

  
}