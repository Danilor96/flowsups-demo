/*
  Warnings:

  - Made the column `key_info_id` on table `Vehicles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title_license_id` on table `Vehicles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vehicle_purchase_info_id` on table `Vehicles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vehicle_general_info_id` on table `Vehicles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Vehicles" ALTER COLUMN "key_info_id" SET NOT NULL,
ALTER COLUMN "title_license_id" SET NOT NULL,
ALTER COLUMN "vehicle_purchase_info_id" SET NOT NULL,
ALTER COLUMN "vehicle_general_info_id" SET NOT NULL;
