-- AlterTable
ALTER TABLE "Client_calls" ADD COLUMN     "note_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Client_calls" ADD CONSTRAINT "Client_calls_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
