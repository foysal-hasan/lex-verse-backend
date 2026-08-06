/*
  Warnings:

  - You are about to drop the column `bkash_number` on the `package_access_requests` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `package_access_requests` table. All the data in the column will be lost.
  - Added the required column `name` to the `package_access_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `package_access_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_id` to the `package_access_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "package_access_requests" DROP COLUMN "bkash_number",
DROP COLUMN "full_name",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "payment_method" TEXT NOT NULL,
ADD COLUMN     "transaction_id" TEXT NOT NULL;
