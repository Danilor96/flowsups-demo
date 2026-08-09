-- AlterTable
ALTER TABLE "Vehicle_details_title_license" ALTER COLUMN "title_owner" DROP NOT NULL,
ALTER COLUMN "ros_title" DROP NOT NULL,
ALTER COLUMN "title_state_id" DROP NOT NULL,
ALTER COLUMN "title_status_id" DROP NOT NULL,
ALTER COLUMN "title_brand_id" DROP NOT NULL,
ALTER COLUMN "license_no" DROP NOT NULL,
ALTER COLUMN "license_state_id" DROP NOT NULL,
ALTER COLUMN "license_expiration" DROP NOT NULL,
ALTER COLUMN "bid_increment" DROP NOT NULL,
ALTER COLUMN "buy_now_price" DROP NOT NULL,
ALTER COLUMN "floor_price" DROP NOT NULL,
ALTER COLUMN "start_bid" DROP NOT NULL,
ALTER COLUMN "start_bid_2" DROP NOT NULL,
ALTER COLUMN "whole_price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vehicles" ALTER COLUMN "trim_id" DROP NOT NULL;
