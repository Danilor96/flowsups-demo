-- CreateTable
CREATE TABLE "Pay_plan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pay_type" TEXT NOT NULL,
    "front_gross" DECIMAL(10,2),
    "back_gross" DECIMAL(10,2),
    "of_cash_down" DECIMAL(10,2),
    "sales_person_id" TEXT,
    "exclude_reserve_or_flat" BOOLEAN DEFAULT false,

    CONSTRAINT "Pay_plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pay_plan_user_id_key" ON "Pay_plan"("user_id");

-- AddForeignKey
ALTER TABLE "Pay_plan" ADD CONSTRAINT "Pay_plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
