/*
  Warnings:

  - You are about to drop the column `daily_visit_history_id` on the `Leads` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Leads" DROP CONSTRAINT "Leads_daily_visit_history_id_fkey";

-- AlterTable
ALTER TABLE "Daily_visit_history" ADD COLUMN     "lead_id" INTEGER;

-- AlterTable
ALTER TABLE "Leads" DROP COLUMN "daily_visit_history_id";

-- AddForeignKey
ALTER TABLE "Daily_visit_history" ADD CONSTRAINT "Daily_visit_history_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
