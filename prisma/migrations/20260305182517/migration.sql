/*
  Warnings:

  - A unique constraint covering the columns `[lead_id]` on the table `Credit_app` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Credit_app" ADD COLUMN     "lead_id" INTEGER;

-- AlterTable
ALTER TABLE "Leads" ADD COLUMN     "credit_app_created_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Credit_app_lead_id_key" ON "Credit_app"("lead_id");

-- AddForeignKey
ALTER TABLE "Credit_app" ADD CONSTRAINT "Credit_app_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
