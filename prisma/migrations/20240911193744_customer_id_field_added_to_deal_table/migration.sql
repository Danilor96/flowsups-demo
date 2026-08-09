/*
  Warnings:

  - Added the required column `customer_id` to the `Deal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "customer_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
