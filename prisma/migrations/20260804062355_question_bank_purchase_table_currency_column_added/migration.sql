/*
  Warnings:

  - You are about to drop the column `price_bdt` on the `question_bank_purchases` table. All the data in the column will be lost.
  - Added the required column `price` to the `question_bank_purchases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "question_bank_purchases" DROP COLUMN "price_bdt",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'BDT',
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;
