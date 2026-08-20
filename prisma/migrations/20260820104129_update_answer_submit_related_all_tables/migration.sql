/*
  Warnings:

  - You are about to drop the column `granted_at` on the `written_exam_allowed_users` table. All the data in the column will be lost.
  - You are about to drop the column `granted_by` on the `written_exam_allowed_users` table. All the data in the column will be lost.
  - You are about to drop the column `admin_note` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `decided_at` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `decided_by` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `decision_note` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `evidence_path` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `evidence_url` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `program` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `program_type` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `reviewed_at` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `reviewed_by` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `ttl_minutes` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `written_exam_resubmission_requests` table. All the data in the column will be lost.
  - You are about to drop the column `answer_text` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `feedback_breakdown` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `file_type` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `file_url` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `prior_evaluations` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `question_id` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `quiz_id` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `resubmission_request_id` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `reviewed_at` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `reviewed_by` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `submission_cycle` on the `written_submissions` table. All the data in the column will be lost.
  - The `status` column on the `written_submissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `written_exam_resubmission_access` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `written_submissions` table without a default value. This is not possible if the table is not empty.
  - Made the column `submitted_at` on table `written_submissions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exam_id` on table `written_submissions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `package_id` on table `written_submissions` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('in_progress', 'submitted', 'auto_submitted');

-- CreateEnum
CREATE TYPE "WrittenSubmissionStatus" AS ENUM ('pending_evaluation', 'evaluated', 'resubmission_requested');

-- DropForeignKey
ALTER TABLE "written_exam_resubmission_access" DROP CONSTRAINT "written_exam_resubmission_access_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "written_exam_resubmission_access" DROP CONSTRAINT "written_exam_resubmission_access_request_id_fkey";

-- DropForeignKey
ALTER TABLE "written_exam_resubmission_access" DROP CONSTRAINT "written_exam_resubmission_access_user_id_fkey";

-- DropForeignKey
ALTER TABLE "written_submissions" DROP CONSTRAINT "written_submissions_package_id_fkey";

-- DropForeignKey
ALTER TABLE "written_submissions" DROP CONSTRAINT "written_submissions_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "written_submissions" DROP CONSTRAINT "written_submissions_reviewed_by_fkey";

-- DropIndex
DROP INDEX "idx_weau_exam";

-- DropIndex
DROP INDEX "idx_weau_exam_user";

-- DropIndex
DROP INDEX "idx_weau_user";

-- DropIndex
DROP INDEX "idx_wer_requests_exam";

-- DropIndex
DROP INDEX "idx_wer_requests_program";

-- DropIndex
DROP INDEX "idx_wer_requests_status";

-- DropIndex
DROP INDEX "idx_wer_requests_user";

-- DropIndex
DROP INDEX "idx_wer_requests_user_exam";

-- DropIndex
DROP INDEX "uq_wer_requests_one_pending";

-- DropIndex
DROP INDEX "idx_written_submissions_quiz";

-- DropIndex
DROP INDEX "idx_written_submissions_status";

-- DropIndex
DROP INDEX "idx_ws_resub_req";

-- DropIndex
DROP INDEX "idx_ws_user_quiz_pkg";

-- DropIndex
DROP INDEX "ws_exam_pkg_idx";

-- DropIndex
DROP INDEX "ws_user_exam_pkg_idx";

-- AlterTable
ALTER TABLE "packages" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "written_exam_allowed_users" DROP COLUMN "granted_at",
DROP COLUMN "granted_by";

-- AlterTable
ALTER TABLE "written_exam_resubmission_requests" DROP COLUMN "admin_note",
DROP COLUMN "decided_at",
DROP COLUMN "decided_by",
DROP COLUMN "decision_note",
DROP COLUMN "evidence_path",
DROP COLUMN "evidence_url",
DROP COLUMN "program",
DROP COLUMN "program_type",
DROP COLUMN "reviewed_at",
DROP COLUMN "reviewed_by",
DROP COLUMN "status",
DROP COLUMN "ttl_minutes",
DROP COLUMN "updated_at",
DROP COLUMN "user_agent",
ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "written_submissions" DROP COLUMN "answer_text",
DROP COLUMN "deleted_at",
DROP COLUMN "feedback_breakdown",
DROP COLUMN "file_type",
DROP COLUMN "file_url",
DROP COLUMN "prior_evaluations",
DROP COLUMN "question_id",
DROP COLUMN "quiz_id",
DROP COLUMN "resubmission_request_id",
DROP COLUMN "reviewed_at",
DROP COLUMN "reviewed_by",
DROP COLUMN "score",
DROP COLUMN "submission_cycle",
ADD COLUMN     "evaluated_by" TEXT,
ADD COLUMN     "file_mime_type" TEXT,
ADD COLUMN     "file_path" TEXT,
ADD COLUMN     "marks_obtained" DECIMAL(65,30),
ADD COLUMN     "text_answer" TEXT,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL,
ALTER COLUMN "submitted_at" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "WrittenSubmissionStatus" NOT NULL DEFAULT 'pending_evaluation',
ALTER COLUMN "exam_id" SET NOT NULL,
ALTER COLUMN "package_id" SET NOT NULL;

-- DropTable
DROP TABLE "written_exam_resubmission_access";

-- CreateTable
CREATE TABLE "exam_attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'in_progress',
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "submitted_at" TIMESTAMPTZ,

    CONSTRAINT "exam_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_answers" (
    "id" TEXT NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_option_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "written_exam_resubmission_accesses" (
    "id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "granted_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "written_exam_resubmission_accesses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_exam_attempts_user_id" ON "exam_attempts"("user_id");

-- CreateIndex
CREATE INDEX "idx_exam_attempts_exam_id" ON "exam_attempts"("exam_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_answers_attempt_id_question_id_key" ON "user_answers"("attempt_id", "question_id");

-- CreateIndex
CREATE INDEX "idx_written_submissions_exam_id" ON "written_submissions"("exam_id");

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "exam_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_submissions" ADD CONSTRAINT "written_submissions_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_submissions" ADD CONSTRAINT "written_submissions_evaluated_by_fkey" FOREIGN KEY ("evaluated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_resubmission_accesses" ADD CONSTRAINT "written_exam_resubmission_accesses_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_resubmission_accesses" ADD CONSTRAINT "written_exam_resubmission_accesses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_resubmission_accesses" ADD CONSTRAINT "written_exam_resubmission_accesses_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_written_submissions_user" RENAME TO "idx_written_submissions_user_id";
