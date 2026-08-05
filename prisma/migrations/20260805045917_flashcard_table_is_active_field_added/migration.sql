/*
  Warnings:

  - You are about to drop the column `allow_download` on the `flashcard_decks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "flashcard_decks" DROP COLUMN "allow_download";

-- AlterTable
ALTER TABLE "flashcards" ADD COLUMN     "is_active" BOOLEAN DEFAULT true;
