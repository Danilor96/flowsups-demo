/*
  Warnings:

  - Added the required column `customer_id` to the `Credit_app_reference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Credit_app_reference" ADD COLUMN     "customer_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Credit_app_reference" ADD CONSTRAINT "Credit_app_reference_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
