-- CreateEnum
CREATE TYPE "RoutineVisibilityScope" AS ENUM ('public', 'premium', 'authenticated');

-- CreateTable
CREATE TABLE "routines" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "program_type" "PkgProgram" NOT NULL,
    "track" "PkgTrack",
    "routine_type" TEXT NOT NULL,
    "routine_number" TEXT,
    "exam_date" DATE,
    "academic_year" INTEGER,
    "session_label" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "file_mime_type" TEXT,
    "file_path" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "visibility_scope" "RoutineVisibilityScope" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT,
    "package_id" TEXT,

    CONSTRAINT "routines_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
