/*
  Warnings:

  - Added the required column `additional` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adversiting` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asking_price` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bid_increment` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buy_now_price` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost_adds` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor_price` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min_deposit` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min_down` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `msrp` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packs` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `special_price` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_bid` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_bid_2` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_cost` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whole_price` to the `Vehicle_details_title_license` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle_details_title_license" ADD COLUMN     "additional" TEXT NOT NULL,
ADD COLUMN     "adversiting" TEXT NOT NULL,
ADD COLUMN     "asking_price" TEXT NOT NULL,
ADD COLUMN     "bid_increment" TEXT NOT NULL,
ADD COLUMN     "buy_now_price" TEXT NOT NULL,
ADD COLUMN     "cost_adds" TEXT NOT NULL,
ADD COLUMN     "floor_price" TEXT NOT NULL,
ADD COLUMN     "min_deposit" TEXT NOT NULL,
ADD COLUMN     "min_down" TEXT NOT NULL,
ADD COLUMN     "msrp" TEXT NOT NULL,
ADD COLUMN     "packs" TEXT NOT NULL,
ADD COLUMN     "special_price" TEXT NOT NULL,
ADD COLUMN     "start_bid" TEXT NOT NULL,
ADD COLUMN     "start_bid_2" TEXT NOT NULL,
ADD COLUMN     "vehicle_cost" TEXT NOT NULL,
ADD COLUMN     "whole_price" TEXT NOT NULL;
