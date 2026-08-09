-- AlterTable
ALTER TABLE "Client_sms" ADD COLUMN     "read_by" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
