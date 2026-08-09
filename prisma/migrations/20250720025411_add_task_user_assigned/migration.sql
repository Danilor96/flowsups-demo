-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "assigned_bdc_id" INTEGER,
ADD COLUMN     "assigned_finance_manager_id" INTEGER,
ADD COLUMN     "assigned_manager_id" INTEGER,
ADD COLUMN     "assigned_seller_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_assigned_seller_id_fkey" FOREIGN KEY ("assigned_seller_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_assigned_bdc_id_fkey" FOREIGN KEY ("assigned_bdc_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_assigned_manager_id_fkey" FOREIGN KEY ("assigned_manager_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_assigned_finance_manager_id_fkey" FOREIGN KEY ("assigned_finance_manager_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
