/*
  Warnings:

  - You are about to drop the column `paymentDate` on the `Deal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "paymentDate";

-- CreateTable
CREATE TABLE "PaymentDate" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dealId" INTEGER NOT NULL,

    CONSTRAINT "PaymentDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmountPerDate" (
    "id" SERIAL NOT NULL,
    "amount" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "paymentDateId" INTEGER NOT NULL,

    CONSTRAINT "AmountPerDate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentDate" ADD CONSTRAINT "PaymentDate_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmountPerDate" ADD CONSTRAINT "AmountPerDate_paymentDateId_fkey" FOREIGN KEY ("paymentDateId") REFERENCES "PaymentDate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
