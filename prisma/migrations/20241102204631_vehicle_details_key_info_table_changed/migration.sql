-- AlterTable
ALTER TABLE "Vehicle_details_key_info" ALTER COLUMN "decal_no" DROP NOT NULL,
ALTER COLUMN "ignition_code" DROP NOT NULL,
ALTER COLUMN "door_key_code" DROP NOT NULL,
ALTER COLUMN "valet_key_code" DROP NOT NULL,
ALTER COLUMN "duplicate_key" SET DEFAULT false,
ALTER COLUMN "lienholder" DROP NOT NULL,
ALTER COLUMN "lien_account_no" DROP NOT NULL,
ALTER COLUMN "payoff_amount" DROP NOT NULL,
ALTER COLUMN "due_date" DROP NOT NULL,
ALTER COLUMN "date_paid_off" DROP NOT NULL,
ALTER COLUMN "payment_method_id" DROP NOT NULL,
ALTER COLUMN "per_diem" DROP NOT NULL,
ALTER COLUMN "memo" DROP NOT NULL;
