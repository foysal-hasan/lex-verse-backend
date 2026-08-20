import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExamSubmissionService } from './exam-submission.service';
import { SubmitAnswerDto, SubmitWrittenExamDto, ResubmissionRequestDto } from './dto/exam-submission.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ClientTime } from 'src/common/decorator/client-time.decorator';


@ApiTags('User - Exam Submissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user/exams')
export class ExamSubmissionController {
  constructor(private readonly submissionService: ExamSubmissionService) {}

  @Get('live')
  @ApiOperation({ summary: 'Get all active live exams for the user' })
  async getLiveExams(@Req() req: any, @ClientTime() referenceTime: Date) {
    return await this.submissionService.getLiveExams(req.user.id, referenceTime);
  }

  @Get('archived')
  @ApiOperation({ summary: 'Get all archived/practice exams for the user' })
  async getArchivedExams(@Req() req: any, @ClientTime() referenceTime: Date) {
    return await this.submissionService.getArchivedExams(req.user.id, referenceTime);
  }

  @Post(':examId/start')
  @ApiOperation({ summary: 'Start or resume an exam (Live or Archive Mode)' })
  async startExam(@Req() req: any, @Param('examId') examId: string, @ClientTime() referenceTime: Date) {
    return await this.submissionService.startOrResumeExam(req.user.id, examId, referenceTime);
  }

  @Post('attempts/:attemptId/answers')
  @ApiOperation({ summary: 'Submit MCQ Answer incrementally' })
  async saveAnswer(@Req() req: any, @Param('attemptId') attemptId: string, @Body() dto: SubmitAnswerDto) {
    return await this.submissionService.saveMcqAnswer(req.user.id, attemptId, dto);
  }

  @Post('attempts/:attemptId/submit')
  @ApiOperation({ summary: 'Finalize and submit MCQ exam (returns score result)' })
  async finalSubmitMcq(@Req() req: any, @Param('attemptId') attemptId: string) {
    return await this.submissionService.finalSubmitMcqExam(req.user.id, attemptId);
  }

  @Post('written/submit')
  @ApiOperation({ summary: 'Submit written exam response' })
  async submitWritten(@Req() req: any, @Body() dto: SubmitWrittenExamDto) {
    return await this.submissionService.submitWrittenExam(req.user.id, dto);
  }

  @Post('written/resubmission-request')
  @ApiOperation({ summary: 'Request written exam resubmission access' })
  async requestResubmission(@Req() req: any, @Body() dto: ResubmissionRequestDto) {
    return await this.submissionService.requestResubmission(req.user.id, dto);
  }
}