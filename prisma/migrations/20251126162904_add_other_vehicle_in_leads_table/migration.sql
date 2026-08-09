-- AlterTable
ALTER TABLE "Leads" ADD COLUMN     "other_vehicle_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_other_vehicle_id_fkey" FOREIGN KEY ("other_vehicle_id") REFERENCES "other_vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
