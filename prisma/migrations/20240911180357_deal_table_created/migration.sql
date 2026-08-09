-- CreateTable
CREATE TABLE "Deal" (
    "id" SERIAL NOT NULL,
    "downpayment" TEXT NOT NULL,
    "paid" TEXT NOT NULL,
    "bonus" TEXT NOT NULL,
    "moneyDuePaid" TEXT NOT NULL,
    "frontend" TEXT NOT NULL,
    "backend" TEXT NOT NULL,
    "totalProfit" TEXT NOT NULL,
    "deferredDownpayment" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3)[],
    "bank" TEXT NOT NULL,
    "sellerCommission" TEXT NOT NULL,
    "bdcCommission" TEXT NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);
