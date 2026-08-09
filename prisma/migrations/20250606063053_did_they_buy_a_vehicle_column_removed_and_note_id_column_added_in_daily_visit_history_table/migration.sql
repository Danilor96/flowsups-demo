/*
  Warnings:

  - You are about to drop the column `didTheyBuyAVehicle` on the `Daily_visit_history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Daily_visit_history" DROP COLUMN "didTheyBuyAVehicle",
ADD COLUMN     "note_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Daily_visit_history" ADD CONSTRAINT "Daily_visit_history_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
