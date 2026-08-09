/*
  Warnings:

  - You are about to drop the column `lead_temperature_id` on the `Client_has_lead` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client_has_lead" DROP CONSTRAINT "Client_has_lead_lead_temperature_id_fkey";

-- AlterTable
ALTER TABLE "Client_has_lead" DROP COLUMN "lead_temperature_id";

-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "lead_temperature_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_lead_temperature_id_fkey" FOREIGN KEY ("lead_temperature_id") REFERENCES "Lead_temperature"("id") ON DELETE SET NULL ON UPDATE CASCADE;
