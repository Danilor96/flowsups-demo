/*
  Warnings:

  - You are about to drop the column `deal_id` on the `Leads` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lead_id]` on the table `Deal` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Leads" DROP CONSTRAINT "Leads_deal_id_fkey";

-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "lead_id" INTEGER;

-- AlterTable
ALTER TABLE "Leads" DROP COLUMN "deal_id";

-- CreateIndex
CREATE UNIQUE INDEX "Deal_lead_id_key" ON "Deal"("lead_id");

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
