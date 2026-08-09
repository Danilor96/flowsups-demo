/*
  Warnings:

  - A unique constraint covering the columns `[message_sid]` on the table `Client_sms` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Client_sms" ADD COLUMN     "delivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "message_sid" TEXT,
ADD COLUMN     "sent" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "date_sent" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Client_sms_message_sid_key" ON "Client_sms"("message_sid");
