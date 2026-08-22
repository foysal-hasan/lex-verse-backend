-- CreateEnum
CREATE TYPE "AttemptMode" AS ENUM ('live', 'archived');

-- AlterTable
ALTER TABLE "exam_attempts" ADD COLUMN     "mode" "AttemptMode" NOT NULL DEFAULT 'archived';
