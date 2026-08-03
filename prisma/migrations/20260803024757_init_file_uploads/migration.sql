-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('PENDING', 'ATTACHED');

-- CreateTable
CREATE TABLE "file_uploads" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "folder" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "status" "FileStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "file_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "file_uploads_url_key" ON "file_uploads"("url");

-- CreateIndex
CREATE INDEX "idx_file_upload_status_created" ON "file_uploads"("status", "created_at");
