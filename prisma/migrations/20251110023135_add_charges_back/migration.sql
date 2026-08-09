-- CreateTable
CREATE TABLE "charges_back" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "business_id" INTEGER NOT NULL,

    CONSTRAINT "charges_back_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "charges_back" ADD CONSTRAINT "charges_back_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
