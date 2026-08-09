-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_lead_source_id_fkey";

-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "lead_source_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_lead_source_id_fkey" FOREIGN KEY ("lead_source_id") REFERENCES "Lead_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
