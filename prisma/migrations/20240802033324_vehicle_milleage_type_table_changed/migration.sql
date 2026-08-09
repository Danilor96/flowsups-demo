/*
  Warnings:

  - You are about to drop the column `make` on the `Vehicle_milleage_type` table. All the data in the column will be lost.
  - Added the required column `type` to the `Vehicle_milleage_type` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle_milleage_type" DROP COLUMN "make",
ADD COLUMN     "type" TEXT NOT NULL;
