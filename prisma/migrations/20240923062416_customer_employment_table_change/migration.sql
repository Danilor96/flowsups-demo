/*
  Warnings:

  - You are about to drop the column `current_employment_address_id` on the `Customer_employment` table. All the data in the column will be lost.
  - You are about to drop the column `previous_employment_address_id` on the `Customer_employment` table. All the data in the column will be lost.
  - Added the required column `customer_employment_id` to the `Customer_employment_address` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Customer_employment" DROP CONSTRAINT "Customer_employment_current_employment_address_id_fkey";

-- DropForeignKey
ALTER TABLE "Customer_employment" DROP CONSTRAINT "Customer_employment_previous_employment_address_id_fkey";

-- AlterTable
ALTER TABLE "Customer_employment" DROP COLUMN "current_employment_address_id",
DROP COLUMN "previous_employment_address_id";

-- AlterTable
ALTER TABLE "Customer_employment_address" ADD COLUMN     "customer_employment_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Customer_employment_address" ADD CONSTRAINT "Customer_employment_address_customer_employment_id_fkey" FOREIGN KEY ("customer_employment_id") REFERENCES "Customer_employment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
