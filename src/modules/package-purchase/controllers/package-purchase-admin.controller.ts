import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PackagePurchaseService } from '../package-purchase.service';
import { ReviewAccessRequestDto } from '../dto/review-access-request.dto';
import { 
  QueryPackageAccessRequestDto, 
  QueryUserPackageAccessDto, 
  PaginationQueryDto 
} from '../dto/query-purchase.dto';
import { ExtendGrantDto, RevokeGrantDto } from '../dto/grant-actions.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';

@ApiTags('Admin - Package Purchases & Access')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@Controller('admin/package-purchases')
export class PackagePurchaseAdminController {
  constructor(private readonly purchaseService: PackagePurchaseService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get overview analytics for purchases & requests (Admin)' })
  async getOverviewAnalytics() {
    return this.purchaseService.getOverviewAnalytics();
  }

  @Get('per-package-metrics')
  @ApiOperation({ summary: 'Get paginated per-package metrics (Admin)' })
  async getPerPackageMetrics(@Query() query: PaginationQueryDto) {
    return this.purchaseService.getPerPackageMetrics(query);
  }

  @Get('requests')
  @ApiOperation({ summary: 'List all user package access requests with filters, search & sort (Admin)' })
  async findAllRequests(@Query() query: QueryPackageAccessRequestDto) {
    return this.purchaseService.findAllRequests(query);
  }

  @Patch('requests/:id/review')
  @ApiOperation({ summary: 'Approve or reject a package access request (Admin)' })
  async reviewRequest(
    @Param('id') id: string,
    @Body() dto: ReviewAccessRequestDto,
    @Req() req: Request,
  ) {
    const adminId = (req.user as any).userId;
    return this.purchaseService.reviewRequest(id, dto, adminId);
  }

  @Get('accesses')
  @ApiOperation({ summary: 'List all user package accesses (Grants page) with package filter & details (Admin)' })
  async findAllUserAccesses(@Query() query: QueryUserPackageAccessDto) {
    return this.purchaseService.findAllUserAccesses(query);
  }

  @Patch('accesses/:id/extend')
  @ApiOperation({ summary: 'Extend a package grant expiration date (Admin)' })
  async extendGrant(
    @Param('id') id: string,
    @Body() dto: ExtendGrantDto,
  ) {
    return this.purchaseService.extendGrant(id, dto);
  }

  @Patch('accesses/:id/revoke')
  @ApiOperation({ summary: 'Revoke an active package grant (Admin)' })
  async revokeGrant(
    @Param('id') id: string,
    @Body() dto: RevokeGrantDto,
    @Req() req: Request,
  ) {
    const adminId = (req.user as any).userId;
    return this.purchaseService.revokeGrant(id, dto, adminId);
  }
}