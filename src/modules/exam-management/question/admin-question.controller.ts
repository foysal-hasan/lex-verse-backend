import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { UserRole } from 'src/generated/prisma/enums';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { BulkUploadQuestionsDto } from './dto/bulk-upload-questions.dto';
import { AdminGetQuestionsQueryDto } from './dto/admin-get-questions-query.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Request } from 'express';


@ApiTags('Admin - Exam Questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/exam-questions')
export class AdminQuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a single exam question' })
  async create(@Body() dto: CreateQuestionDto, @Req() req: Request) {
    const userId = req.user?.userId;
    return await this.questionService.create(dto, userId);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk upload multiple exam questions' })
  async bulkUpload(@Body() dto: BulkUploadQuestionsDto, @Req() req: Request) {  
    const userId = req.user?.userId;
    return await this.questionService.bulkUpload(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exam questions with filter, search, and pagination' })
  async findAll(@Query() query: AdminGetQuestionsQueryDto) {
    return await this.questionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single question by ID' })
  async findOne(@Param('id') id: string) {
    return await this.questionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a question' })
  async update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return await this.questionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a question' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.userId;
    return await this.questionService.remove(id, userId);
  }
}