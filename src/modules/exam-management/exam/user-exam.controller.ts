import { Controller, Get, Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ExamService } from './exam.service';
import { UserGetExamsQueryDto } from './dto/user-get-exams-query.dto';

@ApiTags('User - Exams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('user/exams')
export class UserExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of exams (live, upcoming, archived) without heavy details/questions' })
  async findAll(@Query() query: UserGetExamsQueryDto) {
    return await this.examService.findUserExams(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific exam' })
  async findOne(@Param('id') id: string) {
    return await this.examService.findOne(id);
  }
}