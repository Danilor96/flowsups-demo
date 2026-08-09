-- DropForeignKey
ALTER TABLE "Customer_Report" DROP CONSTRAINT "Customer_Report_owner_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Customer_Report" ADD CONSTRAINT "Customer_Report_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
