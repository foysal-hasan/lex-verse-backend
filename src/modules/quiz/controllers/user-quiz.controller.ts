import { 
  Controller, 
  Get, 
  Param, 
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QuizService } from '../quiz.service';
import { FilterQuizDto } from '../dto/filter-quiz.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';


@ApiTags('Quizzes (User)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('quizzes')
export class UserQuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available public/active quizzes with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of active quizzes returned.' })
  findAll(@Query() filters: FilterQuizDto) {
    return this.quizService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific quiz details by ID for users' })
  @ApiResponse({ status: 200, description: 'Quiz found successfully.' })
  @ApiResponse({ status: 404, description: 'Quiz not found.' })
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }
}