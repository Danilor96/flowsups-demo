/*
  Warnings:

  - You are about to drop the `Detail_sales_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle_details_general_info` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vehicle_details_general_info" DROP CONSTRAINT "Vehicle_details_general_info_condition_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_general_info" DROP CONSTRAINT "Vehicle_details_general_info_emission_status_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_general_info" DROP CONSTRAINT "Vehicle_details_general_info_inspection_status_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_general_info" DROP CONSTRAINT "Vehicle_details_general_info_sales_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_vehicle_general_info_id_fkey";

-- DropTable
DROP TABLE "Detail_sales_type";

-- DropTable
DROP TABLE "Vehicle_details_general_info";

-- CreateTable
CREATE TABLE "Sales_type_category" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Sales_type_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "General_info" (
    "id" SERIAL NOT NULL,
    "sales_type_id" INTEGER NOT NULL,
    "stock_no" TEXT NOT NULL,
    "date_in_stock" TIMESTAMP(3) NOT NULL,
    "ready_to_shell" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "condition_id" INTEGER NOT NULL,
    "inspection_status_id" INTEGER NOT NULL,
    "emission_status_id" INTEGER NOT NULL,

    CONSTRAINT "General_info_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_vehicle_general_info_id_fkey" FOREIGN KEY ("vehicle_general_info_id") REFERENCES "General_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "General_info" ADD CONSTRAINT "General_info_sales_type_id_fkey" FOREIGN KEY ("sales_type_id") REFERENCES "Sales_type_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "General_info" ADD CONSTRAINT "General_info_condition_id_fkey" FOREIGN KEY ("condition_id") REFERENCES "Detail_condition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "General_info" ADD CONSTRAINT "General_info_inspection_status_id_fkey" FOREIGN KEY ("inspection_status_id") REFERENCES "Inspection_status_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "General_info" ADD CONSTRAINT "General_info_emission_status_id_fkey" FOREIGN KEY ("emission_status_id") REFERENCES "Emission_status_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
