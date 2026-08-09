/*
  Warnings:

  - You are about to drop the column `emission_status` on the `Vehicle_details_general_info` table. All the data in the column will be lost.
  - You are about to drop the column `inspection_status` on the `Vehicle_details_general_info` table. All the data in the column will be lost.
  - Added the required column `emission_status_id` to the `Vehicle_details_general_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inspection_status_id` to the `Vehicle_details_general_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle_details_general_info" DROP COLUMN "emission_status",
DROP COLUMN "inspection_status",
ADD COLUMN     "emission_status_id" INTEGER NOT NULL,
ADD COLUMN     "inspection_status_id" INTEGER NOT NULL;

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

-- AddForeignKey
ALTER TABLE "Inspection_status_data" ADD CONSTRAINT "Inspection_status_data_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Inspection_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emission_status_data" ADD CONSTRAINT "Emission_status_data_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Emission_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_general_info" ADD CONSTRAINT "Vehicle_details_general_info_inspection_status_id_fkey" FOREIGN KEY ("inspection_status_id") REFERENCES "Inspection_status_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_general_info" ADD CONSTRAINT "Vehicle_details_general_info_emission_status_id_fkey" FOREIGN KEY ("emission_status_id") REFERENCES "Emission_status_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
