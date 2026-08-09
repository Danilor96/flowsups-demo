-- AlterTable
ALTER TABLE "Deposits" ALTER COLUMN "reference" DROP NOT NULL,
ALTER COLUMN "good_through_date" DROP NOT NULL;
