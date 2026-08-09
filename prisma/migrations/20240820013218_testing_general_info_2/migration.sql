/*
  Warnings:

  - Added the required column `vehicle_general_info_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicles" ADD COLUMN     "vehicle_general_info_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Detail_sales_type" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Detail_sales_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detail_condition" (
    "id" SERIAL NOT NULL,
    "condition" TEXT NOT NULL,

    CONSTRAINT "Detail_condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspection_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Inspection_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspection_status_data" (
    "id" SERIAL NOT NULL,
    "status_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "id_of_status" TEXT NOT NULL,
    "inspected_by" TEXT NOT NULL,

    CONSTRAINT "Inspection_status_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emission_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Emission_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emission_status_data" (
    "id" SERIAL NOT NULL,
    "status_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Emission_status_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_details_general_info" (
    "id" SERIAL NOT NULL,
    "sales_type_id" INTEGER NOT NULL,
    "stock_no" TEXT NOT NULL,
    "date_in_stock" TIMESTAMP(3) NOT NULL,
    "ready_to_shell" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "condition_id" INTEGER NOT NULL,
    "inspection_status_id" INTEGER NOT NULL,
    "emission_status_id" INTEGER NOT NULL,

    CONSTRAINT "Vehicle_details_general_info_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_vehicle_general_info_id_fkey" FOREIGN KEY ("vehicle_general_info_id") REFERENCES "Vehicle_details_general_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection_status_data" ADD CONSTRAINT "Inspection_status_data_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Inspection_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emission_status_data" ADD CONSTRAINT "Emission_status_data_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Emission_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_general_info" ADD CONSTRAINT "Vehicle_details_general_info_sales_type_id_fkey" FOREIGN KEY ("sales_type_id") REFERENCES "Detail_sales_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_general_info" ADD CONSTRAINT "Vehicle_details_general_info_condition_id_fkey" FOREIGN KEY ("condition_id") REFERENCES "Detail_condition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_general_info" ADD CONSTRAINT "Vehicle_details_general_info_inspection_status_id_fkey" FOREIGN KEY ("inspection_status_id") REFERENCES "Inspection_status_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_general_info" ADD CONSTRAINT "Vehicle_details_general_info_emission_status_id_fkey" FOREIGN KEY ("emission_status_id") REFERENCES "Emission_status_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
