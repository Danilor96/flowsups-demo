-- CreateTable
CREATE TABLE "Custom_be_back_reasons" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "Custom_be_back_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Custom_no_sale_reasons" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "Custom_no_sale_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Custom_lost_reasons" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "Custom_lost_reasons_pkey" PRIMARY KEY ("id")
);
