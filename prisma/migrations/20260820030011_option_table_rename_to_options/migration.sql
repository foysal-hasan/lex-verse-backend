/*
  Warnings:

  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_question_id_fkey";

-- DropTable
DROP TABLE "Option";

-- CreateTable
CREATE TABLE "options" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "option_key" TEXT,
    "option_text" TEXT NOT NULL,

    CONSTRAINT "options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "options_question_id_idx" ON "options"("question_id");

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
