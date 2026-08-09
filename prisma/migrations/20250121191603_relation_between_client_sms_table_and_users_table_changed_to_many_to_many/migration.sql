/*
  Warnings:

  - You are about to drop the column `sent_by` on the `Client_sms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client_sms" DROP CONSTRAINT "Client_sms_sent_by_fkey";

-- AlterTable
ALTER TABLE "Client_sms" DROP COLUMN "sent_by";

-- CreateTable
CREATE TABLE "_Client_smsToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Client_smsToUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Client_smsToUsers_B_index" ON "_Client_smsToUsers"("B");

-- AddForeignKey
ALTER TABLE "_Client_smsToUsers" ADD CONSTRAINT "_Client_smsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Client_sms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Client_smsToUsers" ADD CONSTRAINT "_Client_smsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
