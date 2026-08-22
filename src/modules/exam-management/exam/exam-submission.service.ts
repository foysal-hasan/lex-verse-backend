import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SubmitAnswerDto, SubmitWrittenExamDto, ResubmissionRequestDto } from './dto/exam-submission.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttemptMode } from 'src/generated/prisma/enums';
import { UserExamAttemptsQueryDto } from './dto/user-exam-query.dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class ExamSubmissionService {
    constructor(
        private readonly prisma: PrismaService,
        @InjectQueue('exam-timeout-queue') private readonly examTimeoutQueue: Queue,
    ) { }

    // ==================== LIVE & ARCHIVED EXAM LISTS ====================

    async getLiveExams(userId: string, packageId: string, referenceTime: Date) {
        // 1. Fetch package exams filtered by packageId and live window
        const packageExams = await this.prisma.packageExam.findMany({
            where: {
                package_id: packageId,
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

        // 3. Filter out exams already submitted and append written resubmission flags
        const writtenSubmissions = await this.prisma.writtenSubmission.findMany({ where: { user_id: userId } });
        const submissionMap = new Map(writtenSubmissions.map((s) => [s.exam_id, s]));

        const resubmissionRequests = await this.prisma.writtenExamResubmissionRequest.findMany({ where: { user_id: userId } });
        const requestedExamIds = new Set(resubmissionRequests.map((r) => r.exam_id));

        const resubmissionAccesses = await this.prisma.writtenExamResubmissionAccess.findMany({ where: { user_id: userId } });
        const allowedResubmitExamIds = new Set(resubmissionAccesses.map((a) => a.exam_id));

        return packageExams
            .filter((pe) => !submittedExamIds.has(pe.exam_id))
            .map((pe) => ({
                ...pe,
                has_requested_resubmission: requestedExamIds.has(pe.exam_id),
                is_resubmission_allowed: allowedResubmitExamIds.has(pe.exam_id),
            }));
    }

    async getArchivedExams(userId: string, packageId: string, referenceTime: Date) {
        const userAttempts = await this.prisma.examAttempt.findMany({
            where: { user_id: userId, status: { in: ['submitted', 'auto_submitted'] } },
        });
        const submittedExamIds = new Set(userAttempts.map((a) => a.exam_id));

        // Fetch written sub status flags
        const writtenSubmissions = await this.prisma.writtenSubmission.findMany({ where: { user_id: userId } });
        const resubmissionRequests = await this.prisma.writtenExamResubmissionRequest.findMany({ where: { user_id: userId } });
        const requestedExamIds = new Set(resubmissionRequests.map((r) => r.exam_id));

        const resubmissionAccesses = await this.prisma.writtenExamResubmissionAccess.findMany({ where: { user_id: userId } });
        const allowedResubmitExamIds = new Set(resubmissionAccesses.map((a) => a.exam_id));

        // Fetch package exams restricted by packageId
        const packageExams = await this.prisma.packageExam.findMany({
            where: { package_id: packageId },
            include: { exam: true, package: true, routine: true },
        });

        return packageExams
            .filter((pe) => {
                const isGlobalArchive = pe.live_end_datetime < referenceTime;
                const isUserArchived = submittedExamIds.has(pe.exam_id);
                return isGlobalArchive || isUserArchived;
            })
            .map((pe) => ({
                ...pe,
                has_requested_resubmission: requestedExamIds.has(pe.exam_id),
                is_resubmission_allowed: allowedResubmitExamIds.has(pe.exam_id),
            }));
    }

    // ==================== START / RESUME ATTEMPT ====================

    async startOrResumeExam(userId: string, examId: string, packageId: string) {

        const now = new Date();

        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
            include: {
                package_exams: { where: { package_id: packageId } },
                question_sets: { include: { questions: { include: { options: true } } } },
            },
        });

        if (!exam) throw new NotFoundException('Exam not found');

        const packageExam = exam.package_exams[0];
        if (!packageExam) throw new NotFoundException('Exam is not linked to this package');

        const isGlobalArchive = now > packageExam.live_end_datetime;

        const previousSubmissionsCount = await this.prisma.examAttempt.count({
            where: {
                user_id: userId,
                exam_id: examId,
                package_id: packageId,
                status: { in: ['submitted', 'auto_submitted'] }
            },
        });

        const attemptMode = (isGlobalArchive || previousSubmissionsCount > 0) ? 'archived' : 'live';

        // 2. আগে থেকে কোনো active attempt আছে কিনা চেক করা
        let attempt = await this.prisma.examAttempt.findFirst({
            where: { user_id: userId, exam_id: examId, package_id: packageId, status: 'in_progress' },
            include: { answers: true },
        });

        if (attempt) {
            // Epoch millisecond
            if (now.getTime() > new Date(attempt.expires_at).getTime()) {
                await this.finalizeMcqAttempt(attempt.id, 'auto_submitted');
                throw new BadRequestException('Exam time has expired.');
            }
            return { message: 'Resumed active exam session', attempt };
        }

        if (attemptMode === 'live' && previousSubmissionsCount > 0) {
            throw new BadRequestException('You have already submitted this live exam.');
        }

        const durationMinutes = exam.duration_minutes || 30;
        const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

        attempt = await this.prisma.examAttempt.create({
            data: {
                user_id: userId,
                exam_id: examId,
                package_id: packageId,
                mode: attemptMode,
                started_at: now,
                expires_at: expiresAt
            },
            include: { answers: true },
        });

        const delay = expiresAt.getTime() - now.getTime();
        await this.examTimeoutQueue.add(
            'auto-submit',
            { attemptId: attempt.id },
            { delay, removeOnComplete: true },
        );

        return { message: 'Exam started successfully', attempt };
    }
    async getAttemptQuestions(userId: string, attemptId: string) {
        const attempt = await this.prisma.examAttempt.findUnique({
            where: { id: attemptId },
            include: {
                exam: {
                    include: {
                        question_sets: {
                            include: {
                                questions: {
                                    select: {
                                        question_text: true,
                                        question_file_path: true,
                                        question_file_mime_type: true,
                                        marks: true,
                                        guidelines: true,
                                        options: true,
                                        created_at: true,
                                        updated_at: true,
                                    }
                                },
                            },
                        },
                    },
                },
                answers: true,
            },
        });

        if (!attempt || attempt.user_id !== userId) {
            throw new NotFoundException('Attempt not found');
        }


        return {
            attempt
        };
    }

    async getAttemptReview(userId: string, attemptId: string, referenceTime: Date) {
        // 1. Fetch the attempt, exam questions, and user answers
        const attempt = await this.prisma.examAttempt.findUnique({
            where: { id: attemptId },
            include: {
                exam: {
                    include: {
                        question_sets: {
                            include: {
                                questions: {
                                    include: { options: true },
                                },
                            },
                        },
                    },
                },
                answers: {
                    include: { selected_option: true },
                },
            },
        });

        if (!attempt || attempt.user_id !== userId) {
            throw new NotFoundException('Attempt not found');
        }

        // 2. Directly query the specific PackageExam using the attempt's exam_id and package_id
        const packageExam = await this.prisma.packageExam.findFirst({
            where: {
                exam_id: attempt.exam_id,
                package_id: attempt.package_id,
            },
        });

        // 3. Check if the exam is in archive mode (Global live end passed OR attempt mode is archived)
        const isGlobalArchive = packageExam ? referenceTime > packageExam.live_end_datetime : false;
        const isArchiveAttempt = attempt.mode === 'archived';

        if (!isGlobalArchive && !isArchiveAttempt) {
            throw new ForbiddenException('Review with correct answers and explanations is only available once the exam is in archive mode.');
        }

        return {
            attempt,
            questions: attempt.exam.question_sets?.questions || [], // Includes correct answers and explanations
        };
    }

    // ==================== MCQ ANSWERS & SUBMISSION ====================

    async saveMcqAnswer(userId: string, attemptId: string, dto: SubmitAnswerDto) {
        const attempt = await this.prisma.examAttempt.findUnique({
            where: { id: attemptId },
            include: { exam: true },
        });

        if (!attempt || attempt.user_id !== userId) throw new NotFoundException('Attempt not found');
        if (attempt.status !== 'in_progress') throw new BadRequestException('Attempt is closed');


        const currentTime = new Date();
        const currentEpoch = currentTime.getTime();
        const expiresEpoch = new Date(attempt.expires_at).getTime();

        if (currentEpoch > expiresEpoch) {
            throw new BadRequestException('Time limit exceeded');
        }

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

    async getAttemptDetails(userId: string, attemptId: string) {
        const attempt = await this.prisma.examAttempt.findUnique({
            where: { id: attemptId },
            include: {
                exam: {
                    include: {
                        question_sets: {
                            include: {
                                questions: {
                                    include: { options: true },
                                },
                            },
                        },
                    },
                },
                answers: {
                    include: { selected_option: true },
                },
            },
        });

        if (!attempt || attempt.user_id !== userId) {
            throw new NotFoundException('Attempt not found');
        }

        return attempt;
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


    async getExamDetailsWithAnswers(userId: string, packageId: string, examId: string, referenceTime: Date) {
        // 1. Fetch exam with package timeline and questions/options
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
            include: {
                package_exams: { where: { package_id: packageId } },
                question_sets: {
                    include: {
                        questions: {
                            include: { options: true },
                        },
                    },
                },
            },
        });

        if (!exam) throw new NotFoundException('Exam not found');
        const packageExam = exam.package_exams[0];
        if (!packageExam) throw new NotFoundException('Exam is not linked to this package');

        // 2. Check if global archive (live end date is over)
        const isGlobalArchive = referenceTime > packageExam.live_end_datetime;

        // 3. Check if user-specific archive (user has already submitted at least once)
        const previousSubmissionsCount = await this.prisma.examAttempt.count({
            where: {
                user_id: userId,
                exam_id: examId,
                package_id: packageId,
                status: { in: ['submitted', 'auto_submitted'] },
            },
        });

        // 4. Archive Mode Condition: Must be global archive OR user has prior submissions
        const isArchiveMode = isGlobalArchive || previousSubmissionsCount > 0;

        if (!isArchiveMode) {
            throw new ForbiddenException(
                'Exam details with correct answers are locked. They are only available in Archive mode (after the live end date or once you complete your first attempt).'
            );
        }

        return exam;
    }

    // 1. Paginated Attempts with optional examId filter
    async getAttemptsWithStats(userId: string, packageId: string, query: UserExamAttemptsQueryDto) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;

        // Build dynamic where filter
        const whereCondition: Prisma.ExamAttemptWhereInput = {
            user_id: userId,
            package_id: packageId,
        };

        if (query.examId) {
            whereCondition.exam_id = query.examId;
        }

        const [attempts, total] = await Promise.all([
            this.prisma.examAttempt.findMany({
                where: whereCondition,
                include: {
                    answers: { include: { selected_option: true } },
                    exam: {
                        include: {
                            question_sets: {
                                include: { questions: { include: { options: true } } },
                            },
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { started_at: 'desc' },
            }),
            this.prisma.examAttempt.count({
                where: whereCondition,
            }),
        ]);

        const data = attempts.map((attempt) => {
            const questions = attempt.exam.question_sets?.questions || [];
            const totalQuestions = questions.length;
            let right = 0;
            let wrong = 0;

            for (const q of questions) {
                const ans = attempt.answers.find((a) => a.question_id === q.id);
                if (ans && ans.selected_option) {
                    if (ans.selected_option.option_text.trim() === q.correct_answer?.trim()) {
                        right++;
                    } else {
                        wrong++;
                    }
                }
            }

            const answeredCount = attempt.answers.length;
            const unanswered = totalQuestions - answeredCount;

            return {
                ...attempt,
                stats: {
                    total_questions: totalQuestions,
                    right,
                    wrong,
                    unanswered,
                },
            };
        });

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // 2. Aggregated Statistics with optional examId filter
    async getAggregatedStats(userId: string, packageId: string, examId?: string) {
        const whereCondition: Prisma.ExamAttemptWhereInput = {
            user_id: userId,
            package_id: packageId,
            status: { in: ['submitted', 'auto_submitted'] },
        };

        if (examId) {
            whereCondition.exam_id = examId;
        }

        const attempts = await this.prisma.examAttempt.findMany({
            where: whereCondition,
            include: {
                answers: { include: { selected_option: true } },
                exam: {
                    include: {
                        question_sets: {
                            include: { questions: { include: { options: true } } },
                        },
                    },
                },
            },
        });

        let totalRight = 0;
        let totalWrong = 0;
        let totalUnanswered = 0;

        for (const attempt of attempts) {
            const questions = attempt.exam.question_sets?.questions || [];
            const totalQuestions = questions.length;
            let right = 0;
            let wrong = 0;

            for (const q of questions) {
                const ans = attempt.answers.find((a) => a.question_id === q.id);
                if (ans && ans.selected_option) {
                    if (ans.selected_option.option_text.trim() === q.correct_answer?.trim()) {
                        right++;
                    } else {
                        wrong++;
                    }
                }
            }

            totalRight += right;
            totalWrong += wrong;
            totalUnanswered += (totalQuestions - attempt.answers.length);
        }

        return {
            package_id: packageId,
            exam_id: examId || 'all_exams_in_package',
            total_submitted_attempts: attempts.length,
            aggregate_stats: {
                total_right: totalRight,
                total_wrong: totalWrong,
                total_unanswered: totalUnanswered,
            },
        };
    }
}