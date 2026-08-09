/*
  Warnings:

  - You are about to alter the column `amount` on the `Clients_has_referrer` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Clients_has_referrer" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);
