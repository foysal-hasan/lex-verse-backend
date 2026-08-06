import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PackagePurchaseService } from '../package-purchase.service';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { QueryPackageAccessRequestDto, QueryUserPackageAccessDto } from '../dto/query-purchase.dto';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('User - Package Purchases & Access')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('package-purchases')
@UseInterceptors(TransformResponseInterceptor)
export class PackagePurchaseUserController {
  constructor(private readonly purchaseService: PackagePurchaseService) {}

  @Post('request')
  @ApiOperation({ summary: 'Submit manual payment package access request' })
  async createRequest(
    @Body() dto: CreateAccessRequestDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).userId;
    return this.purchaseService.createAccessRequest(userId, dto);
  }

  @Get('requests')
  @ApiOperation({ summary: 'List my submitted package access requests' })
  async findMyRequests(
    @Query() query: QueryPackageAccessRequestDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).userId;
    return this.purchaseService.findMyRequests(userId, query);
  }

  @Get('my-accesses')
  @ApiOperation({ summary: 'List my active package subscriptions/accesses' })
  async findMyAccesses(
    @Query() query: QueryUserPackageAccessDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).userId;
    return this.purchaseService.findMyPackageAccesses(userId, query);
  }
}