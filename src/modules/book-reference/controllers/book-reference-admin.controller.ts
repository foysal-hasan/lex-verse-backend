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
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookReferenceService } from '../book-reference.service';
import { CreateBookReferenceDto } from '../dto/create-book-reference.dto';
import { UpdateBookReferenceDto } from '../dto/update-book-reference.dto';
import { QueryBookReferenceDto } from '../dto/query-book-reference.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('Admin - Book References')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/book-references')
export class BookReferenceAdminController {
  constructor(private readonly bookReferenceService: BookReferenceService) {}

  @Get()
  @ApiOperation({ summary: 'List all book references including drafts (Admin)' })
  async findAll(@Query() query: QueryBookReferenceDto) {
    return this.bookReferenceService.findAll(query, undefined, true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single book reference detail (Admin)' })
  async findOne(@Param('id') id: string) {
    return this.bookReferenceService.findOne(id, undefined, undefined, true);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new book reference (Admin)' })
  async create(@Body() dto: CreateBookReferenceDto, @Req() req: Request) {
    const adminUserId = (req.user as any).userId;
    return this.bookReferenceService.create(adminUserId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book reference (Admin)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookReferenceDto,
  ) {
    return this.bookReferenceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a book reference (Admin)' })
  async remove(@Param('id') id: string) {
    return this.bookReferenceService.remove(id);
  }
}