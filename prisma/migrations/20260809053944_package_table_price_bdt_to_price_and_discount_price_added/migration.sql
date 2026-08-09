/*
  Warnings:

  - You are about to drop the column `price_bdt` on the `packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "packages" DROP COLUMN "price_bdt",
ADD COLUMN     "discount_price" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "price" DECIMAL(65,30) DEFAULT 0;
