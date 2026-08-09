-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_created_by_id_fkey";

-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "from_id" INTEGER;

-- CreateTable
CREATE TABLE "Client_note_from" (
    "id" SERIAL NOT NULL,
    "from" TEXT NOT NULL,

    CONSTRAINT "Client_note_from_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "Client_note_from"("id") ON DELETE CASCADE ON UPDATE CASCADE;
