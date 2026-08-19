import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionSetService } from './question-set.service';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { UserRole } from 'src/generated/prisma/enums';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { CreateQuestionSetDto } from './dto/create-question-set.dto';
import { UpdateQuestionSetDto } from './dto/update-question-set.dto';
import { AdminGetQuestionSetsQueryDto } from './dto/admin-get-question-sets-query.dto';
import { AdminAttachDetachQuestionsDto } from './dto/admin-attach-detach-questions.dto';

@ApiTags('Admin - Question Sets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/question-sets')
export class AdminQuestionSetController {
  constructor(private readonly questionSetService: QuestionSetService) { }

  @Post()
  @ApiOperation({ summary: 'Create a question set with nested questions' })
  async create(@Body() dto: CreateQuestionSetDto) {
    return await this.questionSetService.createWithQuestions(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all question sets' })
  async findAll(@Query() query: AdminGetQuestionSetsQueryDto) {
    return await this.questionSetService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single question set with questions' })
  async findOne(@Param('id') id: string) {
    return await this.questionSetService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a question set' })
  async update(@Param('id') id: string, @Body() dto: UpdateQuestionSetDto) {
    return await this.questionSetService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a question set' })
  async remove(@Param('id') id: string) {
    return await this.questionSetService.remove(id);
  }

  @Post(':id/attach')
  @ApiOperation({ summary: 'Attach existing questions to a question set' })
  async attachQuestions(
    @Param('id') id: string,
    @Body() dto: AdminAttachDetachQuestionsDto,
  ) {
    return await this.questionSetService.attachQuestions(id, dto.question_ids);
  }

  @Post(':id/detach')
  @ApiOperation({ summary: 'Detach existing questions from a question set' })
  async detachQuestions(
    @Param('id') id: string,
    @Body() dto: AdminAttachDetachQuestionsDto,
  ) {
    return await this.questionSetService.detachQuestions(id, dto.question_ids);
  }
}