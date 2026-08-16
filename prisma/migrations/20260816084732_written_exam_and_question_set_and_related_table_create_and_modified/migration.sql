/*
  Warnings:

  - You are about to drop the column `exam_id` on the `written_exam_questions` table. All the data in the column will be lost.
  - You are about to drop the column `order_index` on the `written_exam_questions` table. All the data in the column will be lost.
  - You are about to drop the column `question_image` on the `written_exam_questions` table. All the data in the column will be lost.
  - You are about to drop the column `access_type` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `answer_mode` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `answer_sheet_pdf_url` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `batch_number` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `batch_title` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `exam_date` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `exam_mode` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `live_end_time` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `live_start_time` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `program_types` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `question_image_url` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `question_pdf_url` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `syllabus_no` on the `written_exams` table. All the data in the column will be lost.
  - You are about to drop the column `time_limit` on the `written_exams` table. All the data in the column will be lost.
  - Added the required column `program` to the `written_exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_type_type` to the `written_exams` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WrittenExamQuestionType" AS ENUM ('multiple_questions', 'single_document_pdf_or_image');

-- DropForeignKey
ALTER TABLE "bar_written_submissions" DROP CONSTRAINT "bar_written_submissions_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "written_exam_questions" DROP CONSTRAINT "written_exam_questions_exam_id_fkey";

-- DropIndex
DROP INDEX "idx_written_exams_access_type";

-- DropIndex
DROP INDEX "idx_written_exams_program_types";

-- AlterTable
ALTER TABLE "written_exam_questions" DROP COLUMN "exam_id",
DROP COLUMN "order_index",
DROP COLUMN "question_image",
ADD COLUMN     "question_file_mime_type" TEXT,
ADD COLUMN     "question_file_path" TEXT,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "written_exams" DROP COLUMN "access_type",
DROP COLUMN "answer_mode",
DROP COLUMN "answer_sheet_pdf_url",
DROP COLUMN "batch_number",
DROP COLUMN "batch_title",
DROP COLUMN "exam_date",
DROP COLUMN "exam_mode",
DROP COLUMN "live_end_time",
DROP COLUMN "live_start_time",
DROP COLUMN "program_types",
DROP COLUMN "question_image_url",
DROP COLUMN "question_pdf_url",
DROP COLUMN "status",
DROP COLUMN "subject",
DROP COLUMN "syllabus_no",
DROP COLUMN "time_limit",
ADD COLUMN     "program" "PkgProgram" NOT NULL,
ADD COLUMN     "question_file_mime_type" TEXT,
ADD COLUMN     "question_file_path" TEXT,
ADD COLUMN     "question_set_id" TEXT,
ADD COLUMN     "question_type_type" "WrittenExamQuestionType" NOT NULL,
ADD COLUMN     "subjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "description" DROP DEFAULT;

-- CreateTable
CREATE TABLE "package_written_exams" (
    "package_id" TEXT NOT NULL,
    "written_exam_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "routine_id" TEXT,
    "start_datetime" TIMESTAMPTZ NOT NULL,
    "end_datetime" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "package_written_exams_pkey" PRIMARY KEY ("package_id","written_exam_id")
);

-- CreateTable
CREATE TABLE "question_sets" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "program" "PkgProgram" NOT NULL,
    "track" "PkgTrack" NOT NULL,
    "description" TEXT,

    CONSTRAINT "question_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuestionSetToWrittenExamQuestion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_QuestionSetToWrittenExamQuestion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "idx_package_written_exams_package_id" ON "package_written_exams"("package_id");

-- CreateIndex
CREATE INDEX "idx_package_written_exams_exam_id" ON "package_written_exams"("written_exam_id");

-- CreateIndex
CREATE INDEX "_QuestionSetToWrittenExamQuestion_B_index" ON "_QuestionSetToWrittenExamQuestion"("B");

-- CreateIndex
CREATE INDEX "idx_written_exams_program" ON "written_exams"("program");

-- AddForeignKey
ALTER TABLE "written_exams" ADD CONSTRAINT "written_exams_question_set_id_fkey" FOREIGN KEY ("question_set_id") REFERENCES "question_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exams" ADD CONSTRAINT "written_exams_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_written_exams" ADD CONSTRAINT "package_written_exams_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_written_exams" ADD CONSTRAINT "package_written_exams_written_exam_id_fkey" FOREIGN KEY ("written_exam_id") REFERENCES "written_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_written_exams" ADD CONSTRAINT "package_written_exams_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionSetToWrittenExamQuestion" ADD CONSTRAINT "_QuestionSetToWrittenExamQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "question_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionSetToWrittenExamQuestion" ADD CONSTRAINT "_QuestionSetToWrittenExamQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "written_exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
