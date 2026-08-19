/*
  Warnings:

  - You are about to drop the column `is_live` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the `_QuestionSetToWrittenExamQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exam_sections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `package_written_exams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `written_exams` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ExamVisibility" AS ENUM ('public', 'private');

-- DropForeignKey
ALTER TABLE "_QuestionSetToWrittenExamQuestion" DROP CONSTRAINT "_QuestionSetToWrittenExamQuestion_A_fkey";

-- DropForeignKey
ALTER TABLE "_QuestionSetToWrittenExamQuestion" DROP CONSTRAINT "_QuestionSetToWrittenExamQuestion_B_fkey";

-- DropForeignKey
ALTER TABLE "bar_responses" DROP CONSTRAINT "bar_responses_question_id_fkey";

-- DropForeignKey
ALTER TABLE "package_written_exams" DROP CONSTRAINT "package_written_exams_package_id_fkey";

-- DropForeignKey
ALTER TABLE "package_written_exams" DROP CONSTRAINT "package_written_exams_routine_id_fkey";

-- DropForeignKey
ALTER TABLE "package_written_exams" DROP CONSTRAINT "package_written_exams_written_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_section_id_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_question_id_fkey";

-- DropForeignKey
ALTER TABLE "written_exam_allowed_users" DROP CONSTRAINT "written_exam_allowed_users_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "written_exam_resubmission_access" DROP CONSTRAINT "written_exam_resubmission_access_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "written_exam_resubmission_requests" DROP CONSTRAINT "written_exam_resubmission_requests_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "written_exams" DROP CONSTRAINT "written_exams_created_by_fkey";

-- DropForeignKey
ALTER TABLE "written_exams" DROP CONSTRAINT "written_exams_deleted_by_fkey";

-- DropForeignKey
ALTER TABLE "written_exams" DROP CONSTRAINT "written_exams_question_set_id_fkey";

-- DropForeignKey
ALTER TABLE "written_submissions" DROP CONSTRAINT "written_submissions_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "written_submissions" DROP CONSTRAINT "written_submissions_question_id_fkey";

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "is_live";

-- DropTable
DROP TABLE "_QuestionSetToWrittenExamQuestion";

-- DropTable
DROP TABLE "exam_sections";

-- DropTable
DROP TABLE "package_written_exams";

-- DropTable
DROP TABLE "questions";

-- DropTable
DROP TABLE "written_exams";

-- CreateTable
CREATE TABLE "mcq_questions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "question_text" TEXT,
    "question_file_path" TEXT,
    "question_file_mime_type" TEXT,
    "correct_answer" TEXT NOT NULL,
    "explanation_text" TEXT,
    "explanation_math" TEXT,
    "explanation_file_path" TEXT,
    "explanation_file_mime_type" TEXT,
    "created_by" TEXT,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,

    CONSTRAINT "mcq_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "option_key" TEXT,
    "option_text" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "program" "PkgProgram" NOT NULL,
    "track" "PkgTrack" NOT NULL,
    "total_marks" INTEGER NOT NULL DEFAULT 100,
    "pass_mark_percentage" INTEGER NOT NULL DEFAULT 40,
    "written_exam_question_type_type" "WrittenExamQuestionType",
    "written_exam_question_file_path" TEXT,
    "written_exam_question_file_mime_type" TEXT,
    "visibility" "ExamVisibility" DEFAULT 'public',
    "is_negative_marking" BOOLEAN DEFAULT false,
    "negative_mark_per_question" INTEGER NOT NULL DEFAULT 0,
    "is_free_demo" BOOLEAN DEFAULT false,
    "is_enabled_per_question_time_limit" BOOLEAN NOT NULL DEFAULT false,
    "per_question_time_limit" INTEGER DEFAULT 0,
    "created_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,
    "question_set_id" TEXT,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_exams" (
    "package_id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "routine_id" TEXT,
    "live_start_datetime" TIMESTAMPTZ NOT NULL,
    "live_end_datetime" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "package_exams_pkey" PRIMARY KEY ("package_id","exam_id")
);

-- CreateTable
CREATE TABLE "_ExamQuestionToQuestionSet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExamQuestionToQuestionSet_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "idx_questions_deleted_at" ON "mcq_questions"("deleted_at");

-- CreateIndex
CREATE INDEX "Option_question_id_idx" ON "Option"("question_id");

-- CreateIndex
CREATE INDEX "idx_exams_program" ON "exams"("program");

-- CreateIndex
CREATE INDEX "exams_deleted_at_idx" ON "exams"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_exams_deleted_at" ON "exams"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_package_exams_package_id" ON "package_exams"("package_id");

-- CreateIndex
CREATE INDEX "idx_package_exams_exam_id" ON "package_exams"("exam_id");

-- CreateIndex
CREATE INDEX "_ExamQuestionToQuestionSet_B_index" ON "_ExamQuestionToQuestionSet"("B");

-- AddForeignKey
ALTER TABLE "written_submissions" ADD CONSTRAINT "written_submissions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "mcq_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_question_set_id_fkey" FOREIGN KEY ("question_set_id") REFERENCES "question_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_exams" ADD CONSTRAINT "package_exams_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_exams" ADD CONSTRAINT "package_exams_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_exams" ADD CONSTRAINT "package_exams_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_allowed_users" ADD CONSTRAINT "written_exam_allowed_users_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_resubmission_requests" ADD CONSTRAINT "written_exam_resubmission_requests_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_resubmission_access" ADD CONSTRAINT "written_exam_resubmission_access_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamQuestionToQuestionSet" ADD CONSTRAINT "_ExamQuestionToQuestionSet_A_fkey" FOREIGN KEY ("A") REFERENCES "written_exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamQuestionToQuestionSet" ADD CONSTRAINT "_ExamQuestionToQuestionSet_B_fkey" FOREIGN KEY ("B") REFERENCES "question_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
