/*
  Warnings:

  - You are about to drop the column `note_id` on the `Clients` table. All the data in the column will be lost.
  - Added the required column `client_id` to the `Notes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_note_id_fkey";

-- AlterTable
ALTER TABLE "Clients" DROP COLUMN "note_id";

-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "client_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
