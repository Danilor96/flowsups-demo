/*
  Warnings:

  - A unique constraint covering the columns `[unregistered_customer_id]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "unregistered_customer_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "conversations_unregistered_customer_id_key" ON "conversations"("unregistered_customer_id");

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_unregistered_customer_id_fkey" FOREIGN KEY ("unregistered_customer_id") REFERENCES "Awaiting_unknow_client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
