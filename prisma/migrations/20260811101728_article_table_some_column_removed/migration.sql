/*
  Warnings:

  - You are about to drop the column `author` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `author_image` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "author",
DROP COLUMN "author_image",
DROP COLUMN "description";
