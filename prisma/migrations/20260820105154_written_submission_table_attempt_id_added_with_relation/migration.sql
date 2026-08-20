/*
  Warnings:

  - A unique constraint covering the columns `[attempt_id]` on the table `written_submissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attempt_id` to the `written_submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "written_submissions" ADD COLUMN     "attempt_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "written_submissions_attempt_id_key" ON "written_submissions"("attempt_id");

-- AddForeignKey
ALTER TABLE "written_submissions" ADD CONSTRAINT "written_submissions_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "exam_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
