-- AlterTable
ALTER TABLE "Client_address" ADD COLUMN     "current_data_from_webhook" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "current_data_from_webhook" BOOLEAN NOT NULL DEFAULT false;
