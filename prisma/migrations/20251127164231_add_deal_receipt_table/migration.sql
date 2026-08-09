-- CreateTable
CREATE TABLE "DealReceipt" (
    "id" SERIAL NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dealId" INTEGER NOT NULL,
    "paymentDateId" INTEGER,

    CONSTRAINT "DealReceipt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DealReceipt" ADD CONSTRAINT "DealReceipt_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealReceipt" ADD CONSTRAINT "DealReceipt_paymentDateId_fkey" FOREIGN KEY ("paymentDateId") REFERENCES "PaymentDate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
