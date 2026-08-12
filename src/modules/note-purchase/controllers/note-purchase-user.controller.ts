import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotePurchaseService } from '../note-purchase.service';
import { CreateNotePurchaseDto } from '../dto/create-note-purchase.dto';
import { QueryNotePurchaseDto } from '../dto/query-note-purchase.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('User - Note Purchases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('note-purchases')
export class NotePurchaseUserController {
  constructor(private readonly notePurchaseService: NotePurchaseService) {}

  @Post()
  @ApiOperation({ summary: 'Submit purchase request for a premium note (User)' })
  create(@Body() dto: CreateNotePurchaseDto, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.notePurchaseService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'View own note purchase requests status with pagination, filter, and search (User)' })
  findMyPurchases(@Query() query: QueryNotePurchaseDto, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.notePurchaseService.findAllForUser(userId, query);
  }
}