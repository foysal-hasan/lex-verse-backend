/*
  Warnings:

  - You are about to drop the column `banner_image_url` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `meta_description` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `meta_title` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "banner_image_url",
DROP COLUMN "keywords",
DROP COLUMN "meta_description",
DROP COLUMN "meta_title",
ADD COLUMN     "banner_image" TEXT,
ADD COLUMN     "seo_keywords" TEXT[],
ADD COLUMN     "seo_meta_description" TEXT,
ADD COLUMN     "seo_meta_title" TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "credential" TEXT,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "twitter" TEXT;
