/*
  Warnings:

  - A unique constraint covering the columns `[vehicle_id]` on the table `Vehicle_details_purchase_info` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Vehicle_details_general_info_vehicle_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_details_purchase_info_vehicle_id_key" ON "Vehicle_details_purchase_info"("vehicle_id");
