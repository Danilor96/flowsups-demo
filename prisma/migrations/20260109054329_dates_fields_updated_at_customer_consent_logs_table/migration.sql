-- AlterTable
ALTER TABLE "Customer_consent_logs" ADD COLUMN     "timestamp_confirmed" TIMESTAMP(3),
ALTER COLUMN "timestamp_opt_in" SET DEFAULT CURRENT_TIMESTAMP;
