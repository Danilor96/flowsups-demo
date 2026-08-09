-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "funding_list_status_id" INTEGER;

-- AlterTable
ALTER TABLE "Leads" ADD COLUMN     "customer_funding_list_status_id" INTEGER;

-- CreateTable
CREATE TABLE "Funding_list_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Funding_list_status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_customer_funding_list_status_id_fkey" FOREIGN KEY ("customer_funding_list_status_id") REFERENCES "Funding_list_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_funding_list_status_id_fkey" FOREIGN KEY ("funding_list_status_id") REFERENCES "Funding_list_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
