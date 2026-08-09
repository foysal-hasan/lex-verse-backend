/*
  Warnings:

  - You are about to drop the column `subtitle_bn` on the `packages` table. All the data in the column will be lost.
  - You are about to drop the column `title_bn` on the `packages` table. All the data in the column will be lost.
  - Added the required column `title` to the `packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Rename title_bn to title
ALTER TABLE "packages" RENAME COLUMN "title_bn" TO "title";

-- Rename subtitle_bn to subtitle (if applicable)
ALTER TABLE "packages" RENAME COLUMN "subtitle_bn" TO "subtitle";
