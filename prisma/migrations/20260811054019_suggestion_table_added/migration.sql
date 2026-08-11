-- CreateTable
CREATE TABLE "suggestions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "parent_id" TEXT,
    "category" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "program_types" "PkgProgram"[] DEFAULT ARRAY[]::"PkgProgram"[],
    "tracks" "PkgTrack"[] DEFAULT ARRAY[]::"PkgTrack"[],
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "requires_purchase" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PackageToSuggestions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PackageToSuggestions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PackageToSuggestions_B_index" ON "_PackageToSuggestions"("B");

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "suggestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageToSuggestions" ADD CONSTRAINT "_PackageToSuggestions_A_fkey" FOREIGN KEY ("A") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageToSuggestions" ADD CONSTRAINT "_PackageToSuggestions_B_fkey" FOREIGN KEY ("B") REFERENCES "suggestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
