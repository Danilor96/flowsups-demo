-- AlterTable
ALTER TABLE "Client_vehicle_tradein" ADD COLUMN     "title_license_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_title_license_id_fkey" FOREIGN KEY ("title_license_id") REFERENCES "Vehicle_details_title_license"("id") ON DELETE SET NULL ON UPDATE CASCADE;
