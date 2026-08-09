/*
  Warnings:

  - You are about to drop the column `mobile_phone` on the `Appointments` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_id` on the `Appointments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointments" DROP CONSTRAINT "Appointments_vehicle_id_fkey";

-- AlterTable
ALTER TABLE "Appointments" DROP COLUMN "mobile_phone",
DROP COLUMN "vehicle_id";
