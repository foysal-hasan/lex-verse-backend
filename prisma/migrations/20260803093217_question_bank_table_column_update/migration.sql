/*
  Warnings:

  - You are about to drop the column `amount_bdt` on the `question_bank_purchases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_ref` on the `question_bank_purchases` table. All the data in the column will be lost.
  - You are about to alter the column `price_bdt` on the `question_bank_purchases` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to drop the column `access_type` on the `question_banks` table. All the data in the column will be lost.
  - You are about to drop the column `file_size_bytes` on the `question_banks` table. All the data in the column will be lost.
  - You are about to drop the column `is_premium` on the `question_banks` table. All the data in the column will be lost.
  - You are about to drop the column `is_token_unlockable` on the `question_banks` table. All the data in the column will be lost.
  - You are about to drop the column `original_filename` on the `question_banks` table. All the data in the column will be lost.
  - You are about to drop the column `price_bdt` on the `question_banks` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `question_banks` table. All the data in the column will be lost.
  - You are about to drop the column `token_price` on the `question_banks` table. All the data in the column will be lost.
  - The `tier` column on the `question_banks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `price` to the `question_banks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('free', 'premium');

-- DropForeignKey
ALTER TABLE "bar_responses" DROP CONSTRAINT "bar_responses_question_bank_id_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_question_bank_id_fkey";

-- DropIndex
DROP INDEX "qb_access_idx";

-- DropIndex
DROP INDEX "qb_sort_idx";

-- AlterTable
ALTER TABLE "question_bank_purchases" DROP COLUMN "amount_bdt",
DROP COLUMN "payment_ref",
ALTER COLUMN "price_bdt" DROP DEFAULT,
ALTER COLUMN "price_bdt" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "question_banks" DROP COLUMN "access_type",
DROP COLUMN "file_size_bytes",
DROP COLUMN "is_premium",
DROP COLUMN "is_token_unlockable",
DROP COLUMN "original_filename",
DROP COLUMN "price_bdt",
DROP COLUMN "sort_order",
DROP COLUMN "token_price",
ADD COLUMN     "discount_price" DECIMAL(10,2),
ADD COLUMN     "package_id" TEXT,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
DROP COLUMN "tier",
ADD COLUMN     "tier" "Tier" NOT NULL DEFAULT 'free';

-- CreateIndex
CREATE INDEX "idx_question_banks_tier" ON "question_banks"("tier");

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
