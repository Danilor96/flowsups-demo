-- CreateTable
CREATE TABLE "Payment_method" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,

    CONSTRAINT "Payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_details_key_info" (
    "id" SERIAL NOT NULL,
    "decal_no" TEXT NOT NULL,
    "ignition_code" TEXT NOT NULL,
    "door_key_code" TEXT NOT NULL,
    "valet_key_code" TEXT NOT NULL,
    "duplicate_key" BOOLEAN NOT NULL,
    "lienholder" TEXT NOT NULL,
    "lien_account_no" TEXT NOT NULL,
    "payoff_amount" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "date_paid_off" TIMESTAMP(3) NOT NULL,
    "payment_method_id" INTEGER NOT NULL,
    "per_diem" TEXT NOT NULL,
    "memo" TEXT NOT NULL,

    CONSTRAINT "Vehicle_details_key_info_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle_details_key_info" ADD CONSTRAINT "Vehicle_details_key_info_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "Payment_method"("id") ON DELETE CASCADE ON UPDATE CASCADE;
