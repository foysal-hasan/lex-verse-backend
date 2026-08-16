/*
  Warnings:

  - You are about to drop the column `visibility_scope` on the `routines` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "routines" DROP COLUMN "visibility_scope";

-- DropEnum
DROP TYPE "RoutineVisibilityScope";
