/*
  Warnings:

  - A unique constraint covering the columns `[vin]` on the table `Vehicle_identification_numbers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identification_id]` on the table `Vehicles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_identification_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_identification_numbers_vin_key" ON "Vehicle_identification_numbers"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_identification_id_key" ON "Vehicles"("identification_id");

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_identification_id_fkey" FOREIGN KEY ("identification_id") REFERENCES "Vehicle_identification_numbers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
