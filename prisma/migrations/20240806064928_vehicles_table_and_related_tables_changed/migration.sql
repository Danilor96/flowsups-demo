/*
  Warnings:

  - You are about to drop the column `body_type` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `odometer_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the `Vehicle_cylinders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle_doors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle_gvw` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle_hwy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle_motors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle_mpg_city` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle_weight` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[vehicle_id]` on the table `Vehicle_details_general_info` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vehicle_id]` on the table `Vehicle_details_key_info` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vehicle_id]` on the table `Vehicle_details_purchase_info` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vehicle_id]` on the table `Vehicle_details_title_license` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[engine]` on the table `Vehicle_engine` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[brand]` on the table `Vehicle_make` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[model]` on the table `Vehicle_models` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trim]` on the table `Vehicle_trim` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vehicle_id` to the `Vehicle_details_key_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_id` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body_type_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `odometer` to the `Vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle_details_key_info" ADD COLUMN     "vehicle_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle_details_title_license" ADD COLUMN     "vehicle_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Vehicles" DROP COLUMN "body_type",
DROP COLUMN "odometer_id",
ADD COLUMN     "body_type_id" INTEGER NOT NULL,
ADD COLUMN     "odometer" TEXT NOT NULL;

-- DropTable
DROP TABLE "Vehicle_cylinders";

-- DropTable
DROP TABLE "Vehicle_doors";

-- DropTable
DROP TABLE "Vehicle_gvw";

-- DropTable
DROP TABLE "Vehicle_hwy";

-- DropTable
DROP TABLE "Vehicle_motors";

-- DropTable
DROP TABLE "Vehicle_mpg_city";

-- DropTable
DROP TABLE "Vehicle_weight";

-- CreateTable
CREATE TABLE "Vehicle_body_type" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Vehicle_body_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_body_type_type_key" ON "Vehicle_body_type"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_details_general_info_vehicle_id_key" ON "Vehicle_details_general_info"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_details_key_info_vehicle_id_key" ON "Vehicle_details_key_info"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_details_purchase_info_vehicle_id_key" ON "Vehicle_details_purchase_info"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_details_title_license_vehicle_id_key" ON "Vehicle_details_title_license"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_engine_engine_key" ON "Vehicle_engine"("engine");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_make_brand_key" ON "Vehicle_make"("brand");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_models_model_key" ON "Vehicle_models"("model");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_trim_trim_key" ON "Vehicle_trim"("trim");

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_body_type_id_fkey" FOREIGN KEY ("body_type_id") REFERENCES "Vehicle_body_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_title_license" ADD CONSTRAINT "Vehicle_details_title_license_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_key_info" ADD CONSTRAINT "Vehicle_details_key_info_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
