/*
  Warnings:

  - You are about to drop the `Vehicle_odometer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle_odometer_make` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `milleage_type_id` to the `Vehicle_mileages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_odometer_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_odometer_make_id_fkey";

-- AlterTable
ALTER TABLE "Vehicle_mileages" ADD COLUMN     "milleage_type_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Vehicle_odometer";

-- DropTable
DROP TABLE "Vehicle_odometer_make";

-- CreateTable
CREATE TABLE "Vehicle_milleage_type" (
    "id" SERIAL NOT NULL,
    "make" TEXT NOT NULL,

    CONSTRAINT "Vehicle_milleage_type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle_mileages" ADD CONSTRAINT "Vehicle_mileages_milleage_type_id_fkey" FOREIGN KEY ("milleage_type_id") REFERENCES "Vehicle_milleage_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
