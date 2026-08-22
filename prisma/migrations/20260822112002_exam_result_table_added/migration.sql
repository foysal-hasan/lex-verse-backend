-- CreateTable
CREATE TABLE "exam_results" (
    "id" TEXT NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "exam_format" "ExamFormat" NOT NULL,
    "total_marks" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "obtained_marks" DOUBLE PRECISION,
    "is_graded" BOOLEAN NOT NULL DEFAULT true,
    "percentage" DOUBLE PRECISION,
    "total_questions" INTEGER,
    "right_count" INTEGER,
    "wrong_count" INTEGER,
    "unanswered_count" INTEGER,
    "teacher_feedback" TEXT,
    "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exam_results_attempt_id_key" ON "exam_results"("attempt_id");

-- CreateIndex
CREATE INDEX "idx_exam_results_user_package" ON "exam_results"("user_id", "package_id");

-- CreateIndex
CREATE INDEX "idx_exam_results_exam" ON "exam_results"("exam_id");

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "exam_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
