/*
  Warnings:

  - Added the required column `didTheyBuyAVehicle` to the `Daily_visit_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerTurnover` to the `Daily_visit_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Daily_visit_history" ADD COLUMN     "didTheyBuyAVehicle" BOOLEAN NOT NULL,
ADD COLUMN     "managerTurnover" BOOLEAN NOT NULL;
