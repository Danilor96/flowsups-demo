-- DropForeignKey
ALTER TABLE "Client_has_lead" DROP CONSTRAINT "Client_has_lead_created_by_id_fkey";

-- AlterTable
ALTER TABLE "Client_has_lead" ALTER COLUMN "created_by_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Client_has_lead" ADD CONSTRAINT "Client_has_lead_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
