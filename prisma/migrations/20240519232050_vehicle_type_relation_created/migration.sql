/*
  Warnings:

  - Added the required column `vehicle_type_id` to the `Client_vehicle_tradein` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client_vehicle_tradein" ADD COLUMN     "vehicle_type_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_vehicle_type_id_fkey" FOREIGN KEY ("vehicle_type_id") REFERENCES "Vehicle_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
