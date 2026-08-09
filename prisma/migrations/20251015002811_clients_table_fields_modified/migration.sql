-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_lead_type_id_fkey";

-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "lead_type_id" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "mobile_phone" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_lead_type_id_fkey" FOREIGN KEY ("lead_type_id") REFERENCES "Lead_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
