/*
  Warnings:

  - Made the column `sent_by` on table `Client_sms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Client_sms" ALTER COLUMN "sent_by" SET NOT NULL;
