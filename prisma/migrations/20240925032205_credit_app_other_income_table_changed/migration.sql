/*
  Warnings:

  - You are about to drop the column `credit_app_reference_id` on the `Credit_app_other_income` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `Credit_app_other_income` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Credit_app_other_income" DROP CONSTRAINT "Credit_app_other_income_credit_app_reference_id_fkey";

-- AlterTable
ALTER TABLE "Credit_app_other_income" DROP COLUMN "credit_app_reference_id",
ADD COLUMN     "customer_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Credit_app_other_income" ADD CONSTRAINT "Credit_app_other_income_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
