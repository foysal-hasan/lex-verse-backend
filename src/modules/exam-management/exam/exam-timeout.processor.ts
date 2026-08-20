import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';


@Processor('exam-timeout-queue')
export class ExamTimeoutProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<{ attemptId: string }>): Promise<any> {
    const { attemptId } = job.data;

    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (attempt && attempt.status === 'in_progress') {
      await this.prisma.examAttempt.update({
        where: { id: attemptId },
        data: {
          status: 'auto_submitted',
          submitted_at: new Date(),
        },
      });
      console.log(`⏱️ Exam attempt ${attemptId} auto-submitted due to timer expiration.`);
    }
  }
}