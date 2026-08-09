/*
  Warnings:

  - You are about to drop the column `location_id` on the `Daily_visit_history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Daily_visit_history" DROP COLUMN "location_id",
ADD COLUMN     "location" TEXT;
