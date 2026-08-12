import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookReferenceService } from '../book-reference.service';
import { CreateBookReferenceDto } from '../dto/create-book-reference.dto';
import { UpdateBookReferenceDto } from '../dto/update-book-reference.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { QueryBookReferenceDto } from '../dto/query-book-reference.dto';

@ApiTags('Admin - Book References')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@Controller('admin/book-references')
@UseInterceptors(TransformResponseInterceptor)
export class BookReferenceAdminController {
  constructor(private readonly bookReferenceService: BookReferenceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a book reference with package attachments and visibility rules (Admin)' })
  create(@Body() dto: CreateBookReferenceDto, @Req() req: Request) {
    const userId = (req.user as any)?.userId;
    return this.bookReferenceService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'List all book references without package restriction (Admin)' })
  findAll(@Query() query: QueryBookReferenceDto) {
    return this.bookReferenceService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single book reference by ID (Admin)' })
  findOne(@Param('id') id: string) {
    return this.bookReferenceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book reference (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateBookReferenceDto) {
    return this.bookReferenceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a book reference (Admin)' })
  remove(@Param('id') id: string) {
    return this.bookReferenceService.remove(id);
  }

  @Patch(':id/packages/:packageId/attach')
  @ApiOperation({ summary: 'Attach a book reference to a package (Admin)' })
  attachToPackage(
    @Param('id') id: string,
    @Param('packageId') packageId: string,
  ) {
    return this.bookReferenceService.assignToPackage(id, packageId);
  }

  @Patch(':id/packages/:packageId/detach')
  @ApiOperation({ summary: 'Detach a book reference from a package (Admin)' })
  detachFromPackage(
    @Param('id') id: string,
    @Param('packageId') packageId: string,
  ) {
    return this.bookReferenceService.removeFromPackage(id, packageId);
  }
}