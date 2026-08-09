/*
  Warnings:

  - You are about to drop the column `vehicle_general_info_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the `Detail_condition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Detail_sales_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Emission_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Emission_status_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inspection_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inspection_status_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle_details_general_info` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Emission_status_data" DROP CONSTRAINT "Emission_status_data_status_id_fkey";

-- DropForeignKey
ALTER TABLE "Inspection_status_data" DROP CONSTRAINT "Inspection_status_data_status_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_general_info" DROP CONSTRAINT "Vehicle_details_general_info_condition_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_general_info" DROP CONSTRAINT "Vehicle_details_general_info_emission_status_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_general_info" DROP CONSTRAINT "Vehicle_details_general_info_inspection_status_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_general_info" DROP CONSTRAINT "Vehicle_details_general_info_sales_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_vehicle_general_info_id_fkey";

-- AlterTable
ALTER TABLE "Vehicles" DROP COLUMN "vehicle_general_info_id";

-- DropTable
DROP TABLE "Detail_condition";

-- DropTable
DROP TABLE "Detail_sales_type";

-- DropTable
DROP TABLE "Emission_status";

-- DropTable
DROP TABLE "Emission_status_data";

-- DropTable
DROP TABLE "Inspection_status";

-- DropTable
DROP TABLE "Inspection_status_data";

-- DropTable
DROP TABLE "Vehicle_details_general_info";
