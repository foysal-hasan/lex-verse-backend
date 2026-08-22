import { Controller, Post, Get, Body, Param, UseGuards, Req, UseInterceptors, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExamSubmissionService } from './exam-submission.service';
import { SubmitAnswerDto, SubmitWrittenExamDto, ResubmissionRequestDto } from './dto/exam-submission.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ClientTime } from 'src/common/decorator/client-time.decorator';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { Request } from 'express';
import { UserExamAttemptsQueryDto } from './dto/user-exam-query.dto';


@ApiTags('User - Exam Submissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user/exams')
@UseInterceptors(TransformResponseInterceptor)
export class ExamSubmissionController {
    constructor(private readonly submissionService: ExamSubmissionService) { }

    @ApiOperation({ summary: 'Get all active live exams for a specific package' })
    @Get('package/:packageId/live')
    async getLiveExams(
        @Req() req: Request,
        @Param('packageId') packageId: string,
        @ClientTime() referenceTime: Date,
    ) {
        return await this.submissionService.getLiveExams(req.user.userId, packageId, referenceTime);
    }

    @ApiOperation({ summary: 'Get all archived/practice exams for a specific package' })
    @Get('package/:packageId/archived')
    async getArchivedExams(
        @Req() req: Request,
        @Param('packageId') packageId: string,
        @ClientTime() referenceTime: Date,
    ) {
        return await this.submissionService.getArchivedExams(req.user.userId, packageId, referenceTime);
    }

    @Post('package/:packageId/exams/:examId/start')
    @ApiOperation({ summary: 'Start or resume an exam bound to a package context' })
    async startExam(
        @Req() req: Request,
        @Param('packageId') packageId: string,
        @Param('examId') examId: string
    ) {
        return await this.submissionService.startOrResumeExam(req.user.userId, examId, packageId);
    }

    @Get('package/:packageId/exams/:examId/details-with-answers')
    @ApiOperation({ summary: 'Get full exam details and questions with correct answers (Package & Exam scoped)' })
    async getExamDetailsWithAnswers(
        @Req() req: Request,
        @Param('packageId') packageId: string,
        @Param('examId') examId: string,
        @ClientTime() referenceTime: Date,
    ) {
        return await this.submissionService.getExamDetailsWithAnswers(req.user.userId, packageId, examId, referenceTime);
    }

    @Get('package/:packageId/attempts/paginated')
    @ApiOperation({ summary: 'Get paginated list of attempts for a package (optional query filter: examId)' })
    async getAttemptsWithStats(
        @Req() req: Request,
        @Param('packageId') packageId: string,
        @Query() query: UserExamAttemptsQueryDto,
    ) {
        return await this.submissionService.getAttemptsWithStats(req.user.userId, packageId, query);
    }

    @Get('package/:packageId/statistics/aggregate')
    @ApiOperation({ summary: 'Get aggregated stats across all attempts in a package (optional query filter: examId)' })
    async getAggregatedStats(
        @Req() req: Request,
        @Param('packageId') packageId: string,
        @Query() query: UserExamAttemptsQueryDto,
    ) {
        return await this.submissionService.getAggregatedStats(req.user.userId, packageId, query.examId);
    }

    @Get('attempts/:attemptId')
    @ApiOperation({ summary: 'Get full details of a specific exam attempt' })
    async getAttemptDetails(
        @Req() req: Request,
        @Param('attemptId') attemptId: string,
    ) {
        return await this.submissionService.getAttemptDetails(req.user.userId, attemptId);
    }

    @Get('attempts/:attemptId/questions')
    @ApiOperation({ summary: 'Get exam questions for an active attempt (No correct answers)' })
    async getAttemptQuestions(
        @Req() req: Request,
        @Param('attemptId') attemptId: string,
    ) {
        return await this.submissionService.getAttemptQuestions(req.user.userId, attemptId);
    }

    @Get('attempts/:attemptId/review')
    @ApiOperation({ summary: 'Get full review with correct answers and explanations (Archive mode only)' })
    async getAttemptReview(
        @Req() req: Request,
        @Param('attemptId') attemptId: string,
        @ClientTime() referenceTime: Date,
    ) {
        return await this.submissionService.getAttemptReview(req.user.userId, attemptId, referenceTime);
    }

    @Post('attempts/:attemptId/answers')
    @ApiOperation({ summary: 'Submit MCQ Answer incrementally' })
    async saveAnswer(@Req() req: Request, @Param('attemptId') attemptId: string, @Body() dto: SubmitAnswerDto) {
        return await this.submissionService.saveMcqAnswer(req.user.userId, attemptId, dto);
    }

    @Post('attempts/:attemptId/submit')
    @ApiOperation({ summary: 'Finalize and submit MCQ exam (returns score result)' })
    async finalSubmitMcq(@Req() req: Request, @Param('attemptId') attemptId: string) {
        return await this.submissionService.finalSubmitMcqExam(req.user.userId, attemptId);
    }

    @Post('written/submit')
    @ApiOperation({ summary: 'Submit written exam response' })
    async submitWritten(@Req() req: Request, @Body() dto: SubmitWrittenExamDto) {
        return await this.submissionService.submitWrittenExam(req.user.userId, dto);
    }

    @Post('written/resubmission-request')
    @ApiOperation({ summary: 'Request written exam resubmission access' })
    async requestResubmission(@Req() req: Request, @Body() dto: ResubmissionRequestDto) {
        return await this.submissionService.requestResubmission(req.user.userId, dto);
    }


}