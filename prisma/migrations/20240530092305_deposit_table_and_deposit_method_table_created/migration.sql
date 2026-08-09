-- CreateTable
CREATE TABLE "Deposit_methods" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,

    CONSTRAINT "Deposit_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposits" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "amount" TEXT NOT NULL,
    "processing_fee" TEXT NOT NULL,
    "total" TEXT NOT NULL,
    "method_id" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "deposit_date" TIMESTAMP(3) NOT NULL,
    "good_through_date" TIMESTAMP(3) NOT NULL,
    "non_refundable" BOOLEAN NOT NULL,
    "note_id" INTEGER NOT NULL,

    CONSTRAINT "Deposits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Deposits" ADD CONSTRAINT "Deposits_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposits" ADD CONSTRAINT "Deposits_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposits" ADD CONSTRAINT "Deposits_method_id_fkey" FOREIGN KEY ("method_id") REFERENCES "Deposit_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposits" ADD CONSTRAINT "Deposits_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
