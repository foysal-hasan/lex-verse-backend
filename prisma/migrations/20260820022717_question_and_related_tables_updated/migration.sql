/*
  Warnings:

  - You are about to drop the `_ExamQuestionToQuestionSet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `written_exam_questions` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ExamFormat" AS ENUM ('MCQ', 'WRITTEN');

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_question_id_fkey";

-- DropForeignKey
ALTER TABLE "_ExamQuestionToQuestionSet" DROP CONSTRAINT "_ExamQuestionToQuestionSet_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExamQuestionToQuestionSet" DROP CONSTRAINT "_ExamQuestionToQuestionSet_B_fkey";

-- DropTable
DROP TABLE "_ExamQuestionToQuestionSet";

-- DropTable
DROP TABLE "written_exam_questions";

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "format" "ExamFormat" NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_file_path" TEXT,
    "question_file_mime_type" TEXT,
    "correct_answer" TEXT,
    "explanation_text" TEXT,
    "explanation_math" TEXT,
    "explanation_file_path" TEXT,
    "explanation_file_mime_type" TEXT,
    "marks" DECIMAL(65,30) DEFAULT 10,
    "guidelines" TEXT,
    "created_by" TEXT,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuestionToQuestionSet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_QuestionToQuestionSet_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "questions_deleted_at_idx" ON "questions"("deleted_at");

-- CreateIndex
CREATE INDEX "_QuestionToQuestionSet_B_index" ON "_QuestionToQuestionSet"("B");

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToQuestionSet" ADD CONSTRAINT "_QuestionToQuestionSet_A_fkey" FOREIGN KEY ("A") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToQuestionSet" ADD CONSTRAINT "_QuestionToQuestionSet_B_fkey" FOREIGN KEY ("B") REFERENCES "question_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
