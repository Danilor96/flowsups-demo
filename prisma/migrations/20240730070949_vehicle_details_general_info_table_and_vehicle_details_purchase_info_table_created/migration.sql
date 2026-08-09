-- CreateTable
CREATE TABLE "Vehicle_details_general_info" (
    "id" SERIAL NOT NULL,
    "sales_type" TEXT NOT NULL,
    "stock_no" TEXT NOT NULL,
    "date_in_stock" TIMESTAMP(3) NOT NULL,
    "ready_to_shell" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "inspection_status" TEXT NOT NULL,
    "emission_status" TEXT NOT NULL,
    "vehicle_id" INTEGER NOT NULL,

    CONSTRAINT "Vehicle_details_general_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_details_purchase_info" (
    "id" SERIAL NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "purchaseDetail" TEXT NOT NULL,
    "acqMillIn" TEXT NOT NULL,
    "acqMillType" TEXT NOT NULL,
    "buyer" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "purchaseFrom" TIMESTAMP(3) NOT NULL,
    "howDidYouPay" TEXT NOT NULL,
    "vehicle_id" INTEGER NOT NULL,

    CONSTRAINT "Vehicle_details_purchase_info_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle_details_general_info" ADD CONSTRAINT "Vehicle_details_general_info_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_purchase_info" ADD CONSTRAINT "Vehicle_details_purchase_info_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
