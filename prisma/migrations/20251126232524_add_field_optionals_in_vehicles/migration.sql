/*
  Warnings:

  - You are about to drop the column `other_vehicle_id` on the `Leads` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stock_no]` on the table `Vehicles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stock_no` to the `Vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Leads" DROP CONSTRAINT "Leads_other_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_condition_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_exterior_color_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_fuel_tank_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_interior_color_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_transmission_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_vehicle_status_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_vehicle_type_id_fkey";

-- AlterTable
ALTER TABLE "Leads" DROP COLUMN "other_vehicle_id";

-- AlterTable
ALTER TABLE "Vehicles" ADD COLUMN     "stock_no" TEXT NOT NULL,
ALTER COLUMN "transmission_id" DROP NOT NULL,
ALTER COLUMN "fuel_tank_type_id" DROP NOT NULL,
ALTER COLUMN "condition_id" DROP NOT NULL,
ALTER COLUMN "vehicle_type_id" DROP NOT NULL,
ALTER COLUMN "vehicle_status_id" DROP NOT NULL,
ALTER COLUMN "drive_train_id" DROP NOT NULL,
ALTER COLUMN "engine_id" DROP NOT NULL,
ALTER COLUMN "exterior_color_id" DROP NOT NULL,
ALTER COLUMN "interior_color_id" DROP NOT NULL,
ALTER COLUMN "odometer_make_id" DROP NOT NULL,
ALTER COLUMN "cylinder" DROP NOT NULL,
ALTER COLUMN "doors" DROP NOT NULL,
ALTER COLUMN "gvw" DROP NOT NULL,
ALTER COLUMN "hwy" DROP NOT NULL,
ALTER COLUMN "motor" DROP NOT NULL,
ALTER COLUMN "mpg_city" DROP NOT NULL,
ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "body_type_id" DROP NOT NULL,
ALTER COLUMN "odometer" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_stock_no_key" ON "Vehicles"("stock_no");

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_vehicle_status_id_fkey" FOREIGN KEY ("vehicle_status_id") REFERENCES "Vehicle_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_exterior_color_id_fkey" FOREIGN KEY ("exterior_color_id") REFERENCES "Vehicle_colors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_interior_color_id_fkey" FOREIGN KEY ("interior_color_id") REFERENCES "Vehicle_colors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_transmission_id_fkey" FOREIGN KEY ("transmission_id") REFERENCES "Vehicle_transmissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_fuel_tank_type_id_fkey" FOREIGN KEY ("fuel_tank_type_id") REFERENCES "Vehicle_fuel_tank_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_condition_id_fkey" FOREIGN KEY ("condition_id") REFERENCES "Vehicle_conditions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_vehicle_type_id_fkey" FOREIGN KEY ("vehicle_type_id") REFERENCES "Vehicle_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
