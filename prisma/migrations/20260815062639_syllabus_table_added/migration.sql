-- CreateTable
CREATE TABLE "syllabuses" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "title" TEXT NOT NULL,
    "track" "PkgTrack",
    "content" TEXT,
    "file_path" TEXT,
    "file_mime_type" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "syllabuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PackageToSyllabus" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PackageToSyllabus_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PackageToSyllabus_B_index" ON "_PackageToSyllabus"("B");

-- AddForeignKey
ALTER TABLE "_PackageToSyllabus" ADD CONSTRAINT "_PackageToSyllabus_A_fkey" FOREIGN KEY ("A") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageToSyllabus" ADD CONSTRAINT "_PackageToSyllabus_B_fkey" FOREIGN KEY ("B") REFERENCES "syllabuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
