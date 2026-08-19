import { Controller, Get, Param, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ExamService } from './exam.service';

@ApiTags('User - Exams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('user/exams')
export class UserExamController {
  constructor(private readonly examService: ExamService) {}

  // @Get()
  // @ApiOperation({ summary: 'Get available exams for user' })
  // async findUserExams(@Req() req: Request) {
  //   return await this.examService.findAll();
  // }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific exam' })
  async findOne(@Param('id') id: string) {
    return await this.examService.findOne(id);
  }
}
