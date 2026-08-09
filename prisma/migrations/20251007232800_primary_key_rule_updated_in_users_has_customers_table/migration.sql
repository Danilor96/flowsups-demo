/*
  Warnings:

  - The primary key for the `Users_has_customers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Users_has_customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users_has_customers" DROP CONSTRAINT "Users_has_customers_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Users_has_customers_pkey" PRIMARY KEY ("user_id", "customer_id");
