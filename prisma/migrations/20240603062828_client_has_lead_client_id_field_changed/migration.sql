/*
  Warnings:

  - Made the column `client_id` on table `Client_has_lead` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Client_has_lead" DROP CONSTRAINT "Client_has_lead_client_id_fkey";

-- AlterTable
ALTER TABLE "Client_has_lead" ALTER COLUMN "client_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Client_has_lead" ADD CONSTRAINT "Client_has_lead_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
