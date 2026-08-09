-- CreateTable
CREATE TABLE "Marketing_cost" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "business_id" INTEGER NOT NULL,
    "source_id" INTEGER NOT NULL,

    CONSTRAINT "Marketing_cost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Marketing_cost" ADD CONSTRAINT "Marketing_cost_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marketing_cost" ADD CONSTRAINT "Marketing_cost_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Lead_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
