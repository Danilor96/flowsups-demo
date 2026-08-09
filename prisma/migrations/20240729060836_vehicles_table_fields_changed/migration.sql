/*
  Warnings:

  - You are about to drop the column `body_type_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `cylinder_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `doors_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `gvw_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `hwy_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `motor_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `mpg_city_id` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `weight_id` on the `Vehicles` table. All the data in the column will be lost.
  - Added the required column `body_type` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cylinder` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doors` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gvw` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hwy` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motor` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mpg_city` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_body_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_cylinder_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_doors_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_gvw_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_hwy_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_motor_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_mpg_city_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_weight_id_fkey";

-- AlterTable
ALTER TABLE "Vehicles" DROP COLUMN "body_type_id",
DROP COLUMN "cylinder_id",
DROP COLUMN "doors_id",
DROP COLUMN "gvw_id",
DROP COLUMN "hwy_id",
DROP COLUMN "motor_id",
DROP COLUMN "mpg_city_id",
DROP COLUMN "weight_id",
ADD COLUMN     "body_type" TEXT NOT NULL,
ADD COLUMN     "cylinder" TEXT NOT NULL,
ADD COLUMN     "doors" TEXT NOT NULL,
ADD COLUMN     "gvw" TEXT NOT NULL,
ADD COLUMN     "hwy" TEXT NOT NULL,
ADD COLUMN     "motor" TEXT NOT NULL,
ADD COLUMN     "mpg_city" TEXT NOT NULL,
ADD COLUMN     "weight" TEXT NOT NULL;
