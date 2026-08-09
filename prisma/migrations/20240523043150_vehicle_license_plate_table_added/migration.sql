/*
  Warnings:

  - Added the required column `vehicle_plate_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicles" ADD COLUMN     "vehicle_plate_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Vehicle_license_plates" (
    "id" SERIAL NOT NULL,
    "plate" TEXT NOT NULL,

    CONSTRAINT "Vehicle_license_plates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_vehicle_plate_id_fkey" FOREIGN KEY ("vehicle_plate_id") REFERENCES "Vehicle_license_plates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
