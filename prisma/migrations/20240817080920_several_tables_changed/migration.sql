-- AlterTable
ALTER TABLE "Vehicle_details_purchase_info" ALTER COLUMN "how_did_you_pay" DROP NOT NULL,
ALTER COLUMN "purchase_detail" DROP NOT NULL,
ALTER COLUMN "purchase_from" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle_details_title_license" ADD COLUMN     "buyer_fee" TEXT,
ADD COLUMN     "lot_fee" TEXT,
ALTER COLUMN "additional" DROP NOT NULL,
ALTER COLUMN "adversiting" DROP NOT NULL,
ALTER COLUMN "cost_adds" DROP NOT NULL,
ALTER COLUMN "min_deposit" DROP NOT NULL,
ALTER COLUMN "min_down" DROP NOT NULL,
ALTER COLUMN "msrp" DROP NOT NULL,
ALTER COLUMN "packs" DROP NOT NULL;
