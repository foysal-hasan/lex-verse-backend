/*
  Warnings:

  - You are about to drop the column `download_url` on the `bare_acts` table. All the data in the column will be lost.
  - You are about to drop the column `generated_pdf_url` on the `bare_acts` table. All the data in the column will be lost.
  - You are about to drop the column `pdf_url` on the `bare_acts` table. All the data in the column will be lost.
  - You are about to drop the `bare_act_sections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bare_act_sections" DROP CONSTRAINT "bare_act_sections_act_id_fkey";

-- DropIndex
DROP INDEX "idx_bare_acts_deleted_at";

-- AlterTable
ALTER TABLE "bare_acts" DROP COLUMN "download_url",
DROP COLUMN "generated_pdf_url",
DROP COLUMN "pdf_url",
ALTER COLUMN "updated_at" DROP DEFAULT;

-- DropTable
DROP TABLE "bare_act_sections";
