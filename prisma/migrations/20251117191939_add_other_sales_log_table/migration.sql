-- CreateTable
CREATE TABLE "other_vehicles" (
    "id" SERIAL NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "stock_no" TEXT NOT NULL,
    "vin" TEXT NOT NULL,

    CONSTRAINT "other_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "other_sales_log" (
    "id" SERIAL NOT NULL,
    "customerFirstName" TEXT NOT NULL,
    "customerLastName" TEXT NOT NULL,
    "customerMobile" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "assigned_seller_id" INTEGER,
    "vehicle_id" INTEGER,

    CONSTRAINT "other_sales_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "other_sales_log_vehicle_id_key" ON "other_sales_log"("vehicle_id");

-- AddForeignKey
ALTER TABLE "other_sales_log" ADD CONSTRAINT "other_sales_log_assigned_seller_id_fkey" FOREIGN KEY ("assigned_seller_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "other_sales_log" ADD CONSTRAINT "other_sales_log_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "other_vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
