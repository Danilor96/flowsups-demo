-- AlterTable
ALTER TABLE "Customer_employment" ALTER COLUMN "employment_status_id" DROP NOT NULL,
ALTER COLUMN "occupation_id" DROP NOT NULL,
ALTER COLUMN "year" DROP NOT NULL,
ALTER COLUMN "month_id" DROP NOT NULL,
ALTER COLUMN "income_type_id" DROP NOT NULL,
ALTER COLUMN "montly_income" DROP NOT NULL;
