/*
  Warnings:

  - You are about to drop the column `address` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `country_phone_code_id` on the `Business` table. All the data in the column will be lost.
  - Added the required column `county` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `county_code` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ein_number` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fax_number` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mailling_address` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sales_tax_license` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_id` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_license_number` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_country_phone_code_id_fkey";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "address",
DROP COLUMN "country_phone_code_id",
ADD COLUMN     "county" TEXT NOT NULL,
ADD COLUMN     "county_code" TEXT NOT NULL,
ADD COLUMN     "county_phone_code_id" TEXT,
ADD COLUMN     "ein_number" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "fax_number" TEXT NOT NULL,
ADD COLUMN     "mailling_address" TEXT NOT NULL,
ADD COLUMN     "sales_tax_license" TEXT NOT NULL,
ADD COLUMN     "store_alias" TEXT,
ADD COLUMN     "store_id" TEXT NOT NULL,
ADD COLUMN     "store_license_number" TEXT NOT NULL,
ALTER COLUMN "open" DROP NOT NULL,
ALTER COLUMN "close" DROP NOT NULL,
ALTER COLUMN "enable" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Business_websites" (
    "id" SERIAL NOT NULL,
    "website" TEXT NOT NULL,

    CONSTRAINT "Business_websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business_vehicle_detail_page_url" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Business_vehicle_detail_page_url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business_primary_website_url" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Business_primary_website_url_pkey" PRIMARY KEY ("id")
);
