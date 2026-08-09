/*
  Warnings:

  - Made the column `date_sent` on table `Client_sms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Client_sms" ALTER COLUMN "date_sent" SET NOT NULL,
ALTER COLUMN "date_sent" SET DEFAULT CURRENT_TIMESTAMP;
