-- AlterTable
ALTER TABLE "Customer_Report" ADD COLUMN     "for_company" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "customer_report_permissions" (
    "customer_report_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "customer_report_permissions_pkey" PRIMARY KEY ("customer_report_id","user_id")
);

-- AddForeignKey
ALTER TABLE "customer_report_permissions" ADD CONSTRAINT "customer_report_permissions_customer_report_id_fkey" FOREIGN KEY ("customer_report_id") REFERENCES "Customer_Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_report_permissions" ADD CONSTRAINT "customer_report_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
