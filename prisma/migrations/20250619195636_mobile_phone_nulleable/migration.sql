/*
  Warnings:

  - Made the column `mobile_phone` on table `Clients` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "mobile_phone" SET NOT NULL;
