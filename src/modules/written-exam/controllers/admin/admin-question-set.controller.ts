import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionSetService } from '../../services/question-set.service';
import { CreateQuestionSetDto, UpdateQuestionSetDto } from '../../dto/question-set.dto';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { UserRole } from 'src/generated/prisma/enums';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';

@ApiTags('Admin - Question Sets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/question-sets')
export class AdminQuestionSetController {
  constructor(private readonly questionSetService: QuestionSetService) {}

  @Post()
  @ApiOperation({ summary: 'Create a question set with nested questions' })
  async create(@Body() dto: CreateQuestionSetDto) {
    return await this.questionSetService.createWithQuestions(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all question sets' })
  async findAll() {
    return await this.questionSetService.findAll();
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
}