/*
  Warnings:

  - You are about to drop the column `unregistered_customer_id` on the `Client_sms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client_sms" DROP CONSTRAINT "Client_sms_unregistered_customer_id_fkey";

-- AlterTable
ALTER TABLE "Client_sms" DROP COLUMN "unregistered_customer_id";

-- CreateTable
CREATE TABLE "_Awaiting_unknow_clientToClient_sms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Awaiting_unknow_clientToClient_sms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Awaiting_unknow_clientToClient_sms_B_index" ON "_Awaiting_unknow_clientToClient_sms"("B");

-- AddForeignKey
ALTER TABLE "_Awaiting_unknow_clientToClient_sms" ADD CONSTRAINT "_Awaiting_unknow_clientToClient_sms_A_fkey" FOREIGN KEY ("A") REFERENCES "Awaiting_unknow_client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Awaiting_unknow_clientToClient_sms" ADD CONSTRAINT "_Awaiting_unknow_clientToClient_sms_B_fkey" FOREIGN KEY ("B") REFERENCES "Client_sms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
