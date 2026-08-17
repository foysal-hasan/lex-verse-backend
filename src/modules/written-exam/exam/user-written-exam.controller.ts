import { Controller, Get, Param, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WrittenExamService } from './written-exam.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('User - Written Exams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('user/written-exams')
export class UserWrittenExamController {
  constructor(private readonly writtenExamService: WrittenExamService) {}

  @Get()
  @ApiOperation({ summary: 'Get available written exams for user' })
  async findUserExams(@Req() req: Request) {
    return await this.writtenExamService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific written exam' })
  async findOne(@Param('id') id: string) {
    return await this.writtenExamService.findOne(id);
  }
}