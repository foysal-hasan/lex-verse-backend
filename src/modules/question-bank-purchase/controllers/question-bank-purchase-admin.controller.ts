import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionBankPurchaseService } from '../question-bank-purchase.service';
import { ReviewQuestionBankPurchaseDto } from '../dto/review-purchase.dto';
import { QueryQuestionBankPurchaseDto } from '../dto/query-purchase.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';


@ApiTags('Admin - Question Bank Purchases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/question-bank-purchases')
export class QuestionBankPurchaseAdminController {
  constructor(
    private readonly purchaseService: QuestionBankPurchaseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all user purchase requests' })
  async findAll(@Query() query: QueryQuestionBankPurchaseDto) {
    return this.purchaseService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single purchase request detail (Admin)' })
  async findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(id);
  }

  @Patch(':id/review')
  @ApiOperation({ summary: 'Approve or Reject a Question Bank purchase request' })
  async reviewPurchase(
    @Param('id') id: string,
    @Body() dto: ReviewQuestionBankPurchaseDto,
    @Req() req: any,
  ) {
    const adminUserId = req.user?.id || 'system_admin';
    return this.purchaseService.reviewPurchase(id, dto, adminUserId);
  }
}