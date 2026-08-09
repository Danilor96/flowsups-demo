/*
  Warnings:

  - You are about to drop the column `bank` on the `Deal` table. All the data in the column will be lost.
  - Changed the type of `amount` on the `AmountPerDate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `downpayment` on the `Deal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paid` on the `Deal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `bonus` on the `Deal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `moneyDuePaid` on the `Deal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `frontend` on the `Deal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `backend` on the `Deal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `totalProfit` on the `Deal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `deferredDownpayment` on the `Deal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AmountPerDate" DROP COLUMN "amount",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "bank",
ADD COLUMN     "bank_id" INTEGER,
DROP COLUMN "downpayment",
ADD COLUMN     "downpayment" DECIMAL(65,30) NOT NULL,
DROP COLUMN "paid",
ADD COLUMN     "paid" DECIMAL(65,30) NOT NULL,
DROP COLUMN "bonus",
ADD COLUMN     "bonus" DECIMAL(65,30) NOT NULL,
DROP COLUMN "moneyDuePaid",
ADD COLUMN     "moneyDuePaid" DECIMAL(65,30) NOT NULL,
DROP COLUMN "frontend",
ADD COLUMN     "frontend" DECIMAL(65,30) NOT NULL,
DROP COLUMN "backend",
ADD COLUMN     "backend" DECIMAL(65,30) NOT NULL,
DROP COLUMN "totalProfit",
ADD COLUMN     "totalProfit" DECIMAL(65,30) NOT NULL,
DROP COLUMN "deferredDownpayment",
ADD COLUMN     "deferredDownpayment" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "Banks" (
    "id" SERIAL NOT NULL,
    "bank" TEXT NOT NULL,

    CONSTRAINT "Banks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "Banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
