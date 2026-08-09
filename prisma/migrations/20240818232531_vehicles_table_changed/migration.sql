/*
  Warnings:

  - You are about to drop the column `vehicle_id` on the `Vehicle_details_general_info` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_id` on the `Vehicle_details_key_info` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_id` on the `Vehicle_details_purchase_info` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_id` on the `Vehicle_details_title_license` table. All the data in the column will be lost.
  - Added the required column `key_info_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_license_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_general_info_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_purchase_info_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vehicle_details_general_info" DROP CONSTRAINT "Vehicle_details_general_info_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_key_info" DROP CONSTRAINT "Vehicle_details_key_info_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_purchase_info" DROP CONSTRAINT "Vehicle_details_purchase_info_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_title_license" DROP CONSTRAINT "Vehicle_details_title_license_vehicle_id_fkey";

-- DropIndex
DROP INDEX "Vehicle_details_key_info_vehicle_id_key";

-- DropIndex
DROP INDEX "Vehicle_details_purchase_info_vehicle_id_key";

-- DropIndex
DROP INDEX "Vehicle_details_title_license_vehicle_id_key";

-- AlterTable
ALTER TABLE "Vehicle_details_general_info" DROP COLUMN "vehicle_id";

-- AlterTable
ALTER TABLE "Vehicle_details_key_info" DROP COLUMN "vehicle_id";

-- AlterTable
ALTER TABLE "Vehicle_details_purchase_info" DROP COLUMN "vehicle_id";

-- AlterTable
ALTER TABLE "Vehicle_details_title_license" DROP COLUMN "vehicle_id";

-- AlterTable
ALTER TABLE "Vehicles" ADD COLUMN     "key_info_id" INTEGER NOT NULL,
ADD COLUMN     "title_license_id" INTEGER NOT NULL,
ADD COLUMN     "vehicle_general_info_id" INTEGER NOT NULL,
ADD COLUMN     "vehicle_purchase_info_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_vehicle_general_info_id_fkey" FOREIGN KEY ("vehicle_general_info_id") REFERENCES "Vehicle_details_general_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_vehicle_purchase_info_id_fkey" FOREIGN KEY ("vehicle_purchase_info_id") REFERENCES "Vehicle_details_purchase_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_title_license_id_fkey" FOREIGN KEY ("title_license_id") REFERENCES "Vehicle_details_title_license"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_key_info_id_fkey" FOREIGN KEY ("key_info_id") REFERENCES "Vehicle_details_key_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;
