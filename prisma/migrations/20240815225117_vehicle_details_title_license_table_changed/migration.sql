-- AlterTable
ALTER TABLE "Vehicle_details_title_license" ADD COLUMN     "special_price_end_date" TIMESTAMP(3),
ADD COLUMN     "special_price_start_date" TIMESTAMP(3),
ALTER COLUMN "special_price" DROP NOT NULL;
