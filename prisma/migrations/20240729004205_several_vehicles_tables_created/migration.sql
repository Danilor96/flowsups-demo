/*
  Warnings:

  - You are about to drop the column `brand_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `color_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the `Vehicle_brands` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cylinder_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doors_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drive_train_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engine_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exterior_color_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gvw_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hwy_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interior_color_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `make_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mpg_city_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `odometer_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `odometer_make_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trim_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Client_vehicle_tradein" DROP CONSTRAINT "Client_vehicle_tradein_make_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_color_id_fkey";

-- AlterTable
ALTER TABLE "Vehicles" DROP COLUMN "brand_id",
DROP COLUMN "color_id",
ADD COLUMN     "cylinder_id" INTEGER NOT NULL,
ADD COLUMN     "doors_id" INTEGER NOT NULL,
ADD COLUMN     "drive_train_id" INTEGER NOT NULL,
ADD COLUMN     "engine_id" INTEGER NOT NULL,
ADD COLUMN     "exterior_color_id" INTEGER NOT NULL,
ADD COLUMN     "gvw_id" INTEGER NOT NULL,
ADD COLUMN     "hwy_id" INTEGER NOT NULL,
ADD COLUMN     "interior_color_id" INTEGER NOT NULL,
ADD COLUMN     "make_id" INTEGER NOT NULL,
ADD COLUMN     "mpg_city_id" INTEGER NOT NULL,
ADD COLUMN     "odometer_id" INTEGER NOT NULL,
ADD COLUMN     "odometer_make_id" INTEGER NOT NULL,
ADD COLUMN     "trim_id" INTEGER NOT NULL,
ADD COLUMN     "weight_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Vehicle_brands";

-- CreateTable
CREATE TABLE "Vehicle_make" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,

    CONSTRAINT "Vehicle_make_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_trim" (
    "id" SERIAL NOT NULL,
    "trim" TEXT NOT NULL,

    CONSTRAINT "Vehicle_trim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_engine" (
    "id" SERIAL NOT NULL,
    "engine" TEXT NOT NULL,

    CONSTRAINT "Vehicle_engine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_drive_train" (
    "id" SERIAL NOT NULL,
    "drive_train" TEXT NOT NULL,

    CONSTRAINT "Vehicle_drive_train_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_doors" (
    "id" SERIAL NOT NULL,
    "doors" TEXT NOT NULL,

    CONSTRAINT "Vehicle_doors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_odometer" (
    "id" SERIAL NOT NULL,
    "odometer" TEXT NOT NULL,

    CONSTRAINT "Vehicle_odometer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_odometer_make" (
    "id" SERIAL NOT NULL,
    "make" TEXT NOT NULL,

    CONSTRAINT "Vehicle_odometer_make_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_cylinders" (
    "id" SERIAL NOT NULL,
    "cylinder" TEXT NOT NULL,

    CONSTRAINT "Vehicle_cylinders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_mpg_city" (
    "id" SERIAL NOT NULL,
    "mpg_city" TEXT NOT NULL,

    CONSTRAINT "Vehicle_mpg_city_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_hwy" (
    "id" SERIAL NOT NULL,
    "hwy" TEXT NOT NULL,

    CONSTRAINT "Vehicle_hwy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_weight" (
    "id" SERIAL NOT NULL,
    "weight" TEXT NOT NULL,

    CONSTRAINT "Vehicle_weight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_gvw" (
    "id" SERIAL NOT NULL,
    "gvw" TEXT NOT NULL,

    CONSTRAINT "Vehicle_gvw_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_gvw_id_fkey" FOREIGN KEY ("gvw_id") REFERENCES "Vehicle_gvw"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_weight_id_fkey" FOREIGN KEY ("weight_id") REFERENCES "Vehicle_weight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_hwy_id_fkey" FOREIGN KEY ("hwy_id") REFERENCES "Vehicle_hwy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_mpg_city_id_fkey" FOREIGN KEY ("mpg_city_id") REFERENCES "Vehicle_mpg_city"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_cylinder_id_fkey" FOREIGN KEY ("cylinder_id") REFERENCES "Vehicle_cylinders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_odometer_make_id_fkey" FOREIGN KEY ("odometer_make_id") REFERENCES "Vehicle_odometer_make"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_odometer_id_fkey" FOREIGN KEY ("odometer_id") REFERENCES "Vehicle_odometer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_doors_id_fkey" FOREIGN KEY ("doors_id") REFERENCES "Vehicle_doors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_engine_id_fkey" FOREIGN KEY ("engine_id") REFERENCES "Vehicle_engine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_drive_train_id_fkey" FOREIGN KEY ("drive_train_id") REFERENCES "Vehicle_drive_train"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_trim_id_fkey" FOREIGN KEY ("trim_id") REFERENCES "Vehicle_trim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_make_id_fkey" FOREIGN KEY ("make_id") REFERENCES "Vehicle_make"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_exterior_color_id_fkey" FOREIGN KEY ("exterior_color_id") REFERENCES "Vehicle_colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_interior_color_id_fkey" FOREIGN KEY ("interior_color_id") REFERENCES "Vehicle_colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_make_id_fkey" FOREIGN KEY ("make_id") REFERENCES "Vehicle_make"("id") ON DELETE CASCADE ON UPDATE CASCADE;
