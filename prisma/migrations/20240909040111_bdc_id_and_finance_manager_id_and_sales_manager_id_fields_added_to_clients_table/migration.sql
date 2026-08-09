-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "bdc_id" INTEGER,
ADD COLUMN     "finance_manager_id" INTEGER,
ADD COLUMN     "sales_manager_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_bdc_id_fkey" FOREIGN KEY ("bdc_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_finance_manager_id_fkey" FOREIGN KEY ("finance_manager_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_sales_manager_id_fkey" FOREIGN KEY ("sales_manager_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
