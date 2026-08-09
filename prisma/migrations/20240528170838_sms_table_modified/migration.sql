/*
  Warnings:

  - Added the required column `sent_by` to the `Client_sms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client_sms" ADD COLUMN     "sent_by" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Client_sms" ADD CONSTRAINT "Client_sms_sent_by_fkey" FOREIGN KEY ("sent_by") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
