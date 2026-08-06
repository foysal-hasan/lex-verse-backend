-- CreateTable
CREATE TABLE "book_references" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "program_type" "PkgProgram"[],
    "track" "PkgTrack"[],
    "category" TEXT[],
    "title" TEXT,
    "content" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "book_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookReferenceToPackage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookReferenceToPackage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "book_refs_lookup_idx" ON "book_references"("program_type", "track", "category");

-- CreateIndex
CREATE INDEX "book_references_program_type_gin" ON "book_references" USING GIN ("program_type");

-- CreateIndex
CREATE INDEX "book_references_tracks_gin" ON "book_references" USING GIN ("track");

-- CreateIndex
CREATE INDEX "book_references_categories_gin" ON "book_references" USING GIN ("category");

-- CreateIndex
CREATE INDEX "_BookReferenceToPackage_B_index" ON "_BookReferenceToPackage"("B");

-- AddForeignKey
ALTER TABLE "_BookReferenceToPackage" ADD CONSTRAINT "_BookReferenceToPackage_A_fkey" FOREIGN KEY ("A") REFERENCES "book_references"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookReferenceToPackage" ADD CONSTRAINT "_BookReferenceToPackage_B_fkey" FOREIGN KEY ("B") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
