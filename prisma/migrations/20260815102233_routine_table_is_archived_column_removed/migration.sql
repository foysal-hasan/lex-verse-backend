/*
  Warnings:

  - You are about to drop the column `is_archived` on the `routines` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "routines" DROP COLUMN "is_archived",
ALTER COLUMN "exam_date" SET DATA TYPE TIMESTAMPTZ;
