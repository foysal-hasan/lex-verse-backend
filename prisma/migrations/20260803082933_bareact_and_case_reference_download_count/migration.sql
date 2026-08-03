-- AlterTable
ALTER TABLE "bare_acts" ADD COLUMN     "download_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "case_references" ADD COLUMN     "download_count" INTEGER NOT NULL DEFAULT 0;
