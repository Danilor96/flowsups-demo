/*
  Warnings:

  - You are about to drop the column `prev_address` on the `Credit_app_address` table. All the data in the column will be lost.
  - You are about to drop the column `prev_address_type_id` on the `Credit_app_address` table. All the data in the column will be lost.
  - You are about to drop the column `prev_city` on the `Credit_app_address` table. All the data in the column will be lost.
  - You are about to drop the column `prev_county` on the `Credit_app_address` table. All the data in the column will be lost.
  - You are about to drop the column `prev_month_id` on the `Credit_app_address` table. All the data in the column will be lost.
  - You are about to drop the column `prev_rent_mort` on the `Credit_app_address` table. All the data in the column will be lost.
  - You are about to drop the column `prev_state` on the `Credit_app_address` table. All the data in the column will be lost.
  - You are about to drop the column `prev_state_id` on the `Credit_app_address` table. All the data in the column will be lost.
  - You are about to drop the column `prev_street` on the `Credit_app_address` table. All the data in the column will be lost.
  - You are about to drop the column `prev_year` on the `Credit_app_address` table. All the data in the column will be lost.
  - You are about to drop the column `prev_zip` on the `Credit_app_address` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Credit_app_address" DROP CONSTRAINT "Credit_app_address_prev_address_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit_app_address" DROP CONSTRAINT "Credit_app_address_prev_month_id_fkey";

-- AlterTable
ALTER TABLE "Credit_app_address" DROP COLUMN "prev_address",
DROP COLUMN "prev_address_type_id",
DROP COLUMN "prev_city",
DROP COLUMN "prev_county",
DROP COLUMN "prev_month_id",
DROP COLUMN "prev_rent_mort",
DROP COLUMN "prev_state",
DROP COLUMN "prev_state_id",
DROP COLUMN "prev_street",
DROP COLUMN "prev_year",
DROP COLUMN "prev_zip";

-- CreateTable
CREATE TABLE "Credit_app_address_prev" (
    "id" SERIAL NOT NULL,
    "credit_app_address_id" INTEGER NOT NULL,
    "prev_address" TEXT,
    "prev_street" TEXT,
    "prev_city" TEXT,
    "prev_state" TEXT,
    "prev_state_id" TEXT,
    "prev_zip" TEXT,
    "prev_county" TEXT,
    "prev_year" TEXT,
    "prev_month_id" INTEGER,
    "prev_address_type_id" INTEGER,
    "prev_rent_mort" TEXT,

    CONSTRAINT "Credit_app_address_prev_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Credit_app_address_prev" ADD CONSTRAINT "Credit_app_address_prev_credit_app_address_id_fkey" FOREIGN KEY ("credit_app_address_id") REFERENCES "Credit_app_address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address_prev" ADD CONSTRAINT "Credit_app_address_prev_prev_month_id_fkey" FOREIGN KEY ("prev_month_id") REFERENCES "Credit_app_address_months"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address_prev" ADD CONSTRAINT "Credit_app_address_prev_prev_address_type_id_fkey" FOREIGN KEY ("prev_address_type_id") REFERENCES "Credit_app_address_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
