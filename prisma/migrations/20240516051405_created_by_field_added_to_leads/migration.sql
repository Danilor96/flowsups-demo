/*
  Warnings:

  - Added the required column `created_by_id` to the `Client_has_lead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client_has_lead" ADD COLUMN     "created_by_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Client_has_lead" ADD CONSTRAINT "Client_has_lead_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
