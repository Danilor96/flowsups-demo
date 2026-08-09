-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "born_date_hash" TEXT,
ADD COLUMN     "consent_approved" BOOLEAN DEFAULT false,
ALTER COLUMN "born_date" DROP NOT NULL;
