import { Controller, Get, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotePurchaseService } from '../note-purchase.service';
import { QueryNotePurchaseDto } from '../dto/query-note-purchase.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';
import { UpdateNotePurchaseStatusDto } from '../dto/update-note-purchase.dto';

@ApiTags('Admin - Note Purchases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@Controller('admin/note-purchases')
export class NotePurchaseAdminController {
  constructor(private readonly notePurchaseService: NotePurchaseService) {}

  @Get()
  @ApiOperation({ summary: 'List all user note purchases with filter, search, and pagination (Admin)' })
  findAllAdmin(@Query() query: QueryNotePurchaseDto) {
    return this.notePurchaseService.findAllAdmin(query);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Approve, reject, or modify status of any note purchase request (Admin)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateNotePurchaseStatusDto,
    @Req() req: Request,
  ) {
    const adminId = (req.user as any).userId;
    return this.notePurchaseService.updateStatus(id, adminId, dto);
  }
}