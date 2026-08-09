/*
  Warnings:

  - You are about to drop the column `fuel_tank_capacity_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `standard_features_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `tech_features_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the `Vehicle_fuel_tank_capacities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle_standard_features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle_tech_features` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_fuel_tank_capacity_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_manufacture_year_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_mileage_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_price_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_standard_features_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_tech_features_id_fkey";

-- AlterTable
ALTER TABLE "Vehicles" DROP COLUMN "fuel_tank_capacity_id",
DROP COLUMN "standard_features_id",
DROP COLUMN "tech_features_id",
ALTER COLUMN "manufacture_year_id" DROP NOT NULL,
ALTER COLUMN "price_id" DROP NOT NULL,
ALTER COLUMN "mileage_id" DROP NOT NULL,
ALTER COLUMN "vehicle_plate_id" DROP NOT NULL;

-- DropTable
DROP TABLE "Vehicle_fuel_tank_capacities";

-- DropTable
DROP TABLE "Vehicle_standard_features";

-- DropTable
DROP TABLE "Vehicle_tech_features";

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_manufacture_year_id_fkey" FOREIGN KEY ("manufacture_year_id") REFERENCES "Vehicle_manufacture_years"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "Vehicle_prices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_mileage_id_fkey" FOREIGN KEY ("mileage_id") REFERENCES "Vehicle_mileages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
