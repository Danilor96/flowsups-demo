/*
  Warnings:

  - Added the required column `vehicle_status_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicles" ADD COLUMN     "vehicle_status_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Vehicle_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Vehicle_status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_vehicle_status_id_fkey" FOREIGN KEY ("vehicle_status_id") REFERENCES "Vehicle_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
