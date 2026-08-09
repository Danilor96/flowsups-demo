-- DropForeignKey
ALTER TABLE "Client_has_lead" DROP CONSTRAINT "Client_has_lead_assigned_to_id_fkey";

-- AlterTable
ALTER TABLE "Client_has_lead" ALTER COLUMN "assigned_to_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Client_has_lead" ADD CONSTRAINT "Client_has_lead_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
