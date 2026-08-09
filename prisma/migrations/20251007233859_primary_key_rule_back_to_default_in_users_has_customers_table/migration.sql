/*
  Warnings:

  - The primary key for the `Users_has_customers` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Users_has_customers" DROP CONSTRAINT "Users_has_customers_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Users_has_customers_pkey" PRIMARY KEY ("id");
