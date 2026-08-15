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
  UseInterceptors,
  Req
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QuizService } from '../quiz.service';
import { CreateQuizWithQuestionsDto } from '../dto/create-quiz-with-questions.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { FilterQuizDto } from '../dto/filter-quiz.dto';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/generated/prisma/enums';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { Request } from 'express';

@ApiTags('Quizzes (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/quizzes')
export class AdminQuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quiz with optional questions & image support (Admin)' })
  @ApiResponse({ status: 201, description: 'Quiz successfully created.' })
  create(@Body() dto: CreateQuizWithQuestionsDto, @Req() req: Request) {
    const userId = req.user.userId;
    return this.quizService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quizzes with filtering, sorting, and pagination (Admin)' })
  @ApiResponse({ status: 200, description: 'List of filtered quizzes returned.' })
  findAll(@Query() filters: FilterQuizDto) {
    return this.quizService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz details by ID along with its questions (Admin)' })
  @ApiResponse({ status: 200, description: 'Quiz found successfully.' })
  @ApiResponse({ status: 404, description: 'Quiz not found.' })
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update quiz info (Admin)' })
  @ApiResponse({ status: 200, description: 'Quiz updated successfully.' })
  update(@Param('id') id: string, @Body() dto: UpdateQuizDto) {
    return this.quizService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a quiz (Admin)' })
  @ApiResponse({ status: 200, description: 'Quiz deleted successfully.' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.userId;
    return this.quizService.remove(id, userId);
  }

  @Post(':id/questions')
  @ApiOperation({ summary: 'Add a new question with text/image support to a quiz (Admin)' })
  @ApiResponse({ status: 201, description: 'Question added successfully.' })
  addQuestion(@Param('id') quizId: string, @Body() dto: CreateQuestionDto) {
    return this.quizService.addQuestion(quizId, dto);
  }

  @Delete('questions/:questionId')
  @ApiOperation({ summary: 'Remove/soft delete a specific question from a quiz (Admin)' })
  @ApiResponse({ status: 200, description: 'Question removed successfully.' })
  removeQuestion(@Param('questionId') questionId: string, @Req() req: Request) {
    const userId = req.user?.userId;
    return this.quizService.removeQuestion(questionId, userId);
  }
}