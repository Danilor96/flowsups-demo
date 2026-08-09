/*
  Warnings:

  - A unique constraint covering the columns `[credit_app_id]` on the table `Credit_app_address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[credit_app_id]` on the table `Credit_app_reference` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[credit_app_id]` on the table `Customer_employment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Credit_app_address" ADD COLUMN     "credit_app_id" INTEGER;

-- AlterTable
ALTER TABLE "Credit_app_reference" ADD COLUMN     "credit_app_id" INTEGER;

-- AlterTable
ALTER TABLE "Customer_employment" ADD COLUMN     "credit_app_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Credit_app_address_credit_app_id_key" ON "Credit_app_address"("credit_app_id");

-- CreateIndex
CREATE UNIQUE INDEX "Credit_app_reference_credit_app_id_key" ON "Credit_app_reference"("credit_app_id");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_employment_credit_app_id_key" ON "Customer_employment"("credit_app_id");

-- AddForeignKey
ALTER TABLE "Credit_app_address" ADD CONSTRAINT "Credit_app_address_credit_app_id_fkey" FOREIGN KEY ("credit_app_id") REFERENCES "Credit_app"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_employment" ADD CONSTRAINT "Customer_employment_credit_app_id_fkey" FOREIGN KEY ("credit_app_id") REFERENCES "Credit_app"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_reference" ADD CONSTRAINT "Credit_app_reference_credit_app_id_fkey" FOREIGN KEY ("credit_app_id") REFERENCES "Credit_app"("id") ON DELETE SET NULL ON UPDATE CASCADE;
