-- AlterTable
ALTER TABLE "Vehicles" ALTER COLUMN "key_info_id" DROP NOT NULL,
ALTER COLUMN "title_license_id" DROP NOT NULL,
ALTER COLUMN "vehicle_purchase_info_id" DROP NOT NULL,
ALTER COLUMN "vehicle_general_info_id" DROP NOT NULL;
