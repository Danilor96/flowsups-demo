/*
  Warnings:

  - Changed the type of `reminder_time` on the `Vehicle_delivery` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Vehicle_delivery" DROP COLUMN "reminder_time",
ADD COLUMN     "reminder_time" INTEGER NOT NULL;
