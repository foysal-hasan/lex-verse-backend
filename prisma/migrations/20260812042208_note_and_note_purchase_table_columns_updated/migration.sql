/*
  Warnings:

  - You are about to drop the column `amount_bdt` on the `note_purchases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_ref` on the `note_purchases` table. All the data in the column will be lost.
  - The `status` column on the `note_purchases` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `allow_download` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `file_url` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `free_preview_pages` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `package_ids` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `price_bdt` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `notes` table. All the data in the column will be lost.
  - The `tier` column on the `notes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `payment_method` to the `note_purchases` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NoteTier" AS ENUM ('free', 'premium');

-- CreateEnum
CREATE TYPE "NotePurchaseStatus" AS ENUM ('pending', 'paid', 'refunded', 'rejected', 'failed');

-- DropIndex
DROP INDEX "notes_package_ids_gin";

-- AlterTable
ALTER TABLE "note_purchases" DROP COLUMN "amount_bdt",
DROP COLUMN "payment_ref",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "payment_method" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "NotePurchaseStatus" NOT NULL DEFAULT 'pending',
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "allow_download",
DROP COLUMN "category",
DROP COLUMN "content",
DROP COLUMN "file_url",
DROP COLUMN "free_preview_pages",
DROP COLUMN "package_ids",
DROP COLUMN "price_bdt",
DROP COLUMN "section",
ADD COLUMN     "discount_price" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "download_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "preview_file_mime" TEXT,
ADD COLUMN     "preview_file_path" TEXT,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "subject" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "tier",
ADD COLUMN     "tier" "NoteTier" NOT NULL DEFAULT 'free';

-- CreateTable
CREATE TABLE "_NoteToPackage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NoteToPackage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_NoteToPackage_B_index" ON "_NoteToPackage"("B");

-- CreateIndex
CREATE INDEX "idx_np_status" ON "note_purchases"("status");

-- AddForeignKey
ALTER TABLE "_NoteToPackage" ADD CONSTRAINT "_NoteToPackage_A_fkey" FOREIGN KEY ("A") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoteToPackage" ADD CONSTRAINT "_NoteToPackage_B_fkey" FOREIGN KEY ("B") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
