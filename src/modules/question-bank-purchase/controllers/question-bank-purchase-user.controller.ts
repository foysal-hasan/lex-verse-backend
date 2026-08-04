import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionBankPurchaseService } from '../question-bank-purchase.service';
import { CreateQuestionBankPurchaseDto } from '../dto/create-question-bank-purchase.dto';
import { QueryQuestionBankPurchaseDto } from '../dto/query-purchase.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('User - Question Bank Purchases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('question-bank-purchases')
export class QuestionBankPurchaseUserController {
  constructor(
    private readonly purchaseService: QuestionBankPurchaseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new Question Bank purchase request' })
  async create(
    @Body() dto: CreateQuestionBankPurchaseDto,
    @Req() req: Request,
  ) {
    const userId = req.user.userId;
    return this.purchaseService.createPurchase(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user my purchase history' })
  async findMyPurchases(
    @Query() query: QueryQuestionBankPurchaseDto,
    @Req() req: Request,
  ) {
    const userId = req.user.userId;
    return this.purchaseService.findAll(query, userId);
  }

  // get the list of purchase question bank ids for a user
  @Get('question-bank-ids')
  @ApiOperation({ summary: 'List user my purchase question bank ids' })
  async findMyPurchasedQuestionBankIds(
    @Req() req: Request,
  ) {
    const userId = req.user.userId;
    return this.purchaseService.findMyPurchasedQuestionBankIds(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific purchase request' })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user.userId;
    return this.purchaseService.findOne(id, userId);
  }
}