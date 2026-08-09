/*
  Warnings:

  - Added the required column `client_id` to the `Credit_app` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Credit_app" ADD COLUMN     "client_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Credit_app_address" (
    "id" SERIAL NOT NULL,
    "credit_ap_id" INTEGER NOT NULL,
    "current_address" TEXT,
    "prev_address" TEXT,
    "mailing_address" TEXT,
    "rent_mort" TEXT,

    CONSTRAINT "Credit_app_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit_app_address_months" (
    "id" SERIAL NOT NULL,
    "month" TEXT NOT NULL,

    CONSTRAINT "Credit_app_address_months_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit_app_address_type" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Credit_app_address_type_pkey" PRIMARY KEY ("id")
);
