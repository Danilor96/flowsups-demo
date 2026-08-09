-- AlterTable
ALTER TABLE "Customer_Report" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "default_customer_report_id" INTEGER;

-- CreateTable
CREATE TABLE "_user_favorite_customer_reports" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_user_favorite_customer_reports_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_user_favorite_customer_reports_B_index" ON "_user_favorite_customer_reports"("B");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_default_customer_report_id_fkey" FOREIGN KEY ("default_customer_report_id") REFERENCES "Customer_Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_favorite_customer_reports" ADD CONSTRAINT "_user_favorite_customer_reports_A_fkey" FOREIGN KEY ("A") REFERENCES "Customer_Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_favorite_customer_reports" ADD CONSTRAINT "_user_favorite_customer_reports_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
