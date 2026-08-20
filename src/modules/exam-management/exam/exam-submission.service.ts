import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SubmitAnswerDto, SubmitWrittenExamDto, ResubmissionRequestDto } from './dto/exam-submission.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExamSubmissionService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('exam-timeout-queue') private readonly examTimeoutQueue: Queue,
  ) {}

  // ==================== LIVE & ARCHIVED EXAM LISTS ====================

  async getLiveExams(userId: string, referenceTime: Date) {
    // 1. Get package exams where current time is within live window
    const packageExams = await this.prisma.packageExam.findMany({
      where: {
        live_start_datetime: { lte: referenceTime },
        live_end_datetime: { gte: referenceTime },
      },
      include: { exam: true, package: true, routine: true },
    });

    // 2. Get exams the user has already submitted officially
    const userAttempts = await this.prisma.examAttempt.findMany({
      where: { user_id: userId, status: { in: ['submitted', 'auto_submitted'] } },
    });

    const submittedExamIds = new Set(userAttempts.map((a) => a.exam_id));

    // 3. Return only live exams the user hasn't submitted yet
    return packageExams.filter((pe) => !submittedExamIds.has(pe.exam_id));
  }

async getArchivedExams(userId: string, referenceTime: Date) {
    const userAttempts = await this.prisma.examAttempt.findMany({
      where: { user_id: userId, status: { in: ['submitted', 'auto_submitted'] } },
    });
    const submittedExamIds = new Set(userAttempts.map((a) => a.exam_id));

    // Fetch written submissions for this user to track status
    const writtenSubmissions = await this.prisma.writtenSubmission.findMany({
      where: { user_id: userId },
    });

    // const submissionMap = new Map(writtenSubmissions.map((s) => [s.exam_id, s]));

    // Fetch active resubmission requests
    const resubmissionRequests = await this.prisma.writtenExamResubmissionRequest.findMany({
      where: { user_id: userId },
    });
    const requestedExamIds = new Set(resubmissionRequests.map((r) => r.exam_id));

    // Fetch granted resubmission access tokens
    const resubmissionAccesses = await this.prisma.writtenExamResubmissionAccess.findMany({
      where: { user_id: userId },
    });
    const allowedResubmitExamIds = new Set(resubmissionAccesses.map((a) => a.exam_id));

    const packageExams = await this.prisma.packageExam.findMany({
      include: { exam: true, package: true, routine: true },
    });

    return packageExams
      .filter((pe) => {
        const isGlobalArchive = pe.live_end_datetime < referenceTime;
        const isUserArchived = submittedExamIds.has(pe.exam_id);
        return isGlobalArchive || isUserArchived;
      })
      .map((pe) => {
        const examId = pe.exam_id;
        return {
          ...pe,
          // 👇 Frontend Conditional Flags
          has_requested_resubmission: requestedExamIds.has(examId),
          is_resubmission_allowed: allowedResubmitExamIds.has(examId),
        };
      });
  }

  // ==================== START / RESUME ATTEMPT ====================

  async startOrResumeExam(userId: string, examId: string, referenceTime: Date) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { package_exams: true, question_sets: { include: { questions: { include: { options: true } } } } },
    });
    if (!exam) throw new NotFoundException('Exam not found');

    const packageExam = exam.package_exams[0];
    const isGlobalArchive = packageExam ? referenceTime > packageExam.live_end_datetime : false;

    const previousSubmissionsCount = await this.prisma.examAttempt.count({
      where: { user_id: userId, exam_id: examId, status: { in: ['submitted', 'auto_submitted'] } },
    });

    const isArchiveMode = isGlobalArchive || previousSubmissionsCount > 0;

    if (!isArchiveMode && previousSubmissionsCount > 0) {
      throw new BadRequestException('You have already submitted this live exam. It is now available in Archive mode.');
    }

    let attempt = await this.prisma.examAttempt.findFirst({
      where: { user_id: userId, exam_id: examId, status: 'in_progress' },
      include: { answers: true },
    });

    const now = referenceTime;

    if (attempt) {
      if (now > attempt.expires_at) {
        await this.finalizeMcqAttempt(attempt.id, 'auto_submitted');
        throw new BadRequestException('Exam time has expired.');
      }
      return { message: 'Resumed active exam session', isArchiveMode, attempt };
    }

    const durationMinutes = 30; // Set dynamic duration here
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    attempt = await this.prisma.examAttempt.create({
      data: { user_id: userId, exam_id: examId, expires_at: expiresAt },
      include: { answers: true },
    });

    const delay = expiresAt.getTime() - now.getTime();
    await this.examTimeoutQueue.add(
      'auto-submit',
      { attemptId: attempt.id },
      { delay, removeOnComplete: true },
    );

    return { message: 'Exam started successfully', isArchiveMode, attempt };
  }

  // ==================== MCQ ANSWERS & SUBMISSION ====================

  async saveMcqAnswer(userId: string, attemptId: string, dto: SubmitAnswerDto) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: { exam: true },
    });

    if (!attempt || attempt.user_id !== userId) throw new NotFoundException('Attempt not found');
    if (attempt.status !== 'in_progress') throw new BadRequestException('Attempt is closed');
    if (new Date() > attempt.expires_at) throw new BadRequestException('Time limit exceeded');

    if (attempt.exam.is_allow_answer_change) {
      return await this.prisma.userAnswer.upsert({
        where: { attempt_id_question_id: { attempt_id: attemptId, question_id: dto.question_id } },
        update: { selected_option_id: dto.selected_option_id },
        create: { attempt_id: attemptId, question_id: dto.question_id, selected_option_id: dto.selected_option_id },
      });
    } else {
      try {
        return await this.prisma.userAnswer.create({
          data: { attempt_id: attemptId, question_id: dto.question_id, selected_option_id: dto.selected_option_id },
        });
      } catch (error) {
        throw new BadRequestException('Answer already submitted. Changes are locked.');
      }
    }
  }

  async finalSubmitMcqExam(userId: string, attemptId: string) {
    return await this.finalizeMcqAttempt(attemptId, 'submitted', userId);
  }

  private async finalizeMcqAttempt(attemptId: string, status: 'submitted' | 'auto_submitted', userId?: string) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: { include: { selected_option: true } },
        exam: { include: { question_sets: { include: { questions: { include: { options: true } } } } } },
      },
    });

    if (!attempt) throw new NotFoundException('Attempt not found');
    if (userId && attempt.user_id !== userId) throw new ForbiddenException('Unauthorized');
    if (attempt.status !== 'in_progress') return attempt;

    const questions = attempt.exam.question_sets?.questions || [];
    let correctCount = 0;
    let wrongCount = 0;

    for (const question of questions) {
      const userAnswer = attempt.answers.find((a) => a.question_id === question.id);
      if (userAnswer) {
        // Evaluate correct_answer == option_text
        if (userAnswer.selected_option.option_text.trim() === question.correct_answer?.trim()) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    }

    const updatedAttempt = await this.prisma.examAttempt.update({
      where: { id: attemptId },
      data: { status, submitted_at: new Date() },
    });

    return {
      message: 'Exam submitted successfully',
      result: {
        totalQuestions: questions.length,
        correctCount,
        wrongCount,
        score: correctCount,
      },
      attempt: updatedAttempt,
    };
  }

  // ==================== WRITTEN EXAM SUBMISSIONS ====================

  async submitWrittenExam(userId: string, dto: SubmitWrittenExamDto) {
    const attempt = await this.prisma.examAttempt.findUnique({ where: { id: dto.attempt_id } });
    if (!attempt || attempt.user_id !== userId) throw new NotFoundException('Attempt not found');
    if (attempt.status !== 'in_progress') throw new BadRequestException('Attempt already completed');

    const existing = await this.prisma.writtenSubmission.findFirst({ where: { exam_id: dto.exam_id, user_id: userId } });
    if (existing) {
      const access = await this.prisma.writtenExamResubmissionAccess.findFirst({ where: { exam_id: dto.exam_id, user_id: userId } });
      if (!access) throw new ForbiddenException('Resubmission not approved by admin');
      await this.prisma.writtenExamResubmissionAccess.delete({ where: { id: access.id } });
    }

    return await this.prisma.$transaction([
      this.prisma.writtenSubmission.create({
        data: {
          exam_id: dto.exam_id,
          package_id: dto.package_id,
          user_id: userId,
          attempt_id: dto.attempt_id,
          text_answer: dto.text_answer,
          file_path: dto.file_path,
          status: 'pending_evaluation',
        },
      }),
      this.prisma.examAttempt.update({ where: { id: dto.attempt_id }, data: { status: 'submitted', submitted_at: new Date() } }),
    ]);
  }

  async requestResubmission(userId: string, dto: ResubmissionRequestDto) {
    return await this.prisma.writtenExamResubmissionRequest.create({
      data: { exam_id: dto.exam_id, user_id: userId, reason: dto.reason },
    });
  }
}