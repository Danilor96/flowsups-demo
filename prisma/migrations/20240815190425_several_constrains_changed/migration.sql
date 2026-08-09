-- DropForeignKey
ALTER TABLE "Vehicle_details_key_info" DROP CONSTRAINT "Vehicle_details_key_info_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_manufacture_year_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_mileage_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_price_id_fkey";

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_manufacture_year_id_fkey" FOREIGN KEY ("manufacture_year_id") REFERENCES "Vehicle_manufacture_years"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "Vehicle_prices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_mileage_id_fkey" FOREIGN KEY ("mileage_id") REFERENCES "Vehicle_mileages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_key_info" ADD CONSTRAINT "Vehicle_details_key_info_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
