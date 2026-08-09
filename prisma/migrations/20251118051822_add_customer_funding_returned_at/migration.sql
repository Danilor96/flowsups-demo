-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "client_funding_returned_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Leads" ADD COLUMN     "customer_funding_returned_at" TIMESTAMP(3);
