-- 1. Add the new column with a default value of 30 for existing rows
ALTER TABLE "exams" ADD COLUMN "duration_minutes" INTEGER NOT NULL DEFAULT 30;

-- 2. Drop the default constants for all three columns
ALTER TABLE "exams" ALTER COLUMN "duration_minutes" DROP DEFAULT;
ALTER TABLE "exams" ALTER COLUMN "total_marks" DROP DEFAULT;
ALTER TABLE "exams" ALTER COLUMN "pass_mark_percentage" DROP DEFAULT;