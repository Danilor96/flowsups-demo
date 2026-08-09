/*
  Warnings:

  - You are about to drop the column `condition` on the `Vehicle_details_general_info` table. All the data in the column will be lost.
  - You are about to drop the column `sales_type` on the `Vehicle_details_general_info` table. All the data in the column will be lost.
  - You are about to drop the column `acqMillIn` on the `Vehicle_details_purchase_info` table. All the data in the column will be lost.
  - You are about to drop the column `acqMillType` on the `Vehicle_details_purchase_info` table. All the data in the column will be lost.
  - You are about to drop the column `howDidYouPay` on the `Vehicle_details_purchase_info` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseDate` on the `Vehicle_details_purchase_info` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseDetail` on the `Vehicle_details_purchase_info` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseFrom` on the `Vehicle_details_purchase_info` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Vehicle_details_purchase_info` table. All the data in the column will be lost.
  - Added the required column `condition_id` to the `Vehicle_details_general_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sales_type_id` to the `Vehicle_details_general_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `acq_mill_in` to the `Vehicle_details_purchase_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `acq_mill_type_id` to the `Vehicle_details_purchase_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `how_did_you_pay` to the `Vehicle_details_purchase_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_date` to the `Vehicle_details_purchase_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_detail` to the `Vehicle_details_purchase_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_from` to the `Vehicle_details_purchase_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_id` to the `Vehicle_details_purchase_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle_details_general_info" DROP COLUMN "condition",
DROP COLUMN "sales_type",
ADD COLUMN     "condition_id" INTEGER NOT NULL,
ADD COLUMN     "sales_type_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle_details_purchase_info" DROP COLUMN "acqMillIn",
DROP COLUMN "acqMillType",
DROP COLUMN "howDidYouPay",
DROP COLUMN "purchaseDate",
DROP COLUMN "purchaseDetail",
DROP COLUMN "purchaseFrom",
DROP COLUMN "source",
ADD COLUMN     "acq_mill_in" TEXT NOT NULL,
ADD COLUMN     "acq_mill_type_id" INTEGER NOT NULL,
ADD COLUMN     "how_did_you_pay" TEXT NOT NULL,
ADD COLUMN     "purchase_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "purchase_detail" TEXT NOT NULL,
ADD COLUMN     "purchase_from" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "source_id" INTEGER NOT NULL;

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
CREATE TABLE "Detail_source" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "Detail_source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detail_acq_mill_type" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Detail_acq_mill_type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle_details_general_info" ADD CONSTRAINT "Vehicle_details_general_info_sales_type_id_fkey" FOREIGN KEY ("sales_type_id") REFERENCES "Detail_sales_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_general_info" ADD CONSTRAINT "Vehicle_details_general_info_condition_id_fkey" FOREIGN KEY ("condition_id") REFERENCES "Detail_condition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_purchase_info" ADD CONSTRAINT "Vehicle_details_purchase_info_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Detail_source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_purchase_info" ADD CONSTRAINT "Vehicle_details_purchase_info_acq_mill_type_id_fkey" FOREIGN KEY ("acq_mill_type_id") REFERENCES "Detail_acq_mill_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
