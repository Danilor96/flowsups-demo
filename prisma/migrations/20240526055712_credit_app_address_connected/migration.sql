/*
  Warnings:

  - You are about to drop the column `credit_ap_id` on the `Credit_app_address` table. All the data in the column will be lost.
  - You are about to drop the column `rent_mort` on the `Credit_app_address` table. All the data in the column will be lost.
  - Added the required column `client_id` to the `Credit_app_address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Credit_app_address" DROP COLUMN "credit_ap_id",
DROP COLUMN "rent_mort",
ADD COLUMN     "client_id" INTEGER NOT NULL,
ADD COLUMN     "current_address_type_id" INTEGER,
ADD COLUMN     "current_month_id" INTEGER,
ADD COLUMN     "current_rent_mort" TEXT,
ADD COLUMN     "current_year" TEXT,
ADD COLUMN     "prev_address_type_id" INTEGER,
ADD COLUMN     "prev_month_id" INTEGER,
ADD COLUMN     "prev_rent_mort" TEXT,
ADD COLUMN     "prev_year" TEXT;

-- AddForeignKey
ALTER TABLE "Credit_app_address" ADD CONSTRAINT "Credit_app_address_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address" ADD CONSTRAINT "Credit_app_address_current_month_id_fkey" FOREIGN KEY ("current_month_id") REFERENCES "Credit_app_address_months"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address" ADD CONSTRAINT "Credit_app_address_current_address_type_id_fkey" FOREIGN KEY ("current_address_type_id") REFERENCES "Credit_app_address_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address" ADD CONSTRAINT "Credit_app_address_prev_month_id_fkey" FOREIGN KEY ("prev_month_id") REFERENCES "Credit_app_address_months"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address" ADD CONSTRAINT "Credit_app_address_prev_address_type_id_fkey" FOREIGN KEY ("prev_address_type_id") REFERENCES "Credit_app_address_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
