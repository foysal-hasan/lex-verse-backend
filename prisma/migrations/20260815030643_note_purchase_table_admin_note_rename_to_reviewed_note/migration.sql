/*
  Warnings:

  - You are about to drop the column `admin_note` on the `note_purchases` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "note_purchases" DROP COLUMN "admin_note",
ADD COLUMN     "reviewed_note" TEXT;
