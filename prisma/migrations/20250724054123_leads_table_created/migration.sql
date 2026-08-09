/*
  Warnings:

  - You are about to drop the column `client_id_id` on the `Client_vehicle_wishlist` table. All the data in the column will be lost.
  - You are about to drop the `Customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customers_age` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customers_gender` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customers_status` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `client_id` to the `Client_vehicle_wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Client_vehicle_wishlist" DROP CONSTRAINT "Client_vehicle_wishlist_client_id_id_fkey";

-- DropForeignKey
ALTER TABLE "Customers" DROP CONSTRAINT "Customers_age_id_fkey";

-- DropForeignKey
ALTER TABLE "Customers" DROP CONSTRAINT "Customers_gender_id_fkey";

-- DropForeignKey
ALTER TABLE "Customers" DROP CONSTRAINT "Customers_status_id_fkey";

-- AlterTable
ALTER TABLE "Client_vehicle_wishlist" DROP COLUMN "client_id_id",
ADD COLUMN     "client_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Customers";

-- DropTable
DROP TABLE "Customers_age";

-- DropTable
DROP TABLE "Customers_gender";

-- DropTable
DROP TABLE "Customers_status";

-- CreateTable
CREATE TABLE "Leads" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMP(3),
    "has_ended" BOOLEAN NOT NULL DEFAULT false,
    "sales_rep_id" INTEGER,
    "bdc_id" INTEGER,
    "finance_manager_id" INTEGER,
    "sales_manager_id" INTEGER,
    "appointment_id" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "vehicle_id" INTEGER,
    "task_id" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "note_id" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "customer_cobuyer_id" INTEGER,
    "customer_status_id" INTEGER,
    "customer_referrer_id" INTEGER,
    "customer_credit_app_list_status_id" INTEGER,
    "lead_temperature_id" INTEGER,
    "deposit_id" INTEGER,
    "client_has_lead_id" INTEGER,
    "client_vehicle_wishlist_id" INTEGER,
    "client_vehicle_tradein_id" INTEGER,
    "deal_id" INTEGER,
    "paymentDate_id" INTEGER,
    "amountPerDate_id" INTEGER,
    "vehicle_delivery_id" INTEGER,
    "daily_visit_history_id" INTEGER,

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_sales_rep_id_fkey" FOREIGN KEY ("sales_rep_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_bdc_id_fkey" FOREIGN KEY ("bdc_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_finance_manager_id_fkey" FOREIGN KEY ("finance_manager_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_sales_manager_id_fkey" FOREIGN KEY ("sales_manager_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_customer_cobuyer_id_fkey" FOREIGN KEY ("customer_cobuyer_id") REFERENCES "Client_has_cobuyer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_customer_status_id_fkey" FOREIGN KEY ("customer_status_id") REFERENCES "Client_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_customer_referrer_id_fkey" FOREIGN KEY ("customer_referrer_id") REFERENCES "Clients_has_referrer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_customer_credit_app_list_status_id_fkey" FOREIGN KEY ("customer_credit_app_list_status_id") REFERENCES "Credit_app_list_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_lead_temperature_id_fkey" FOREIGN KEY ("lead_temperature_id") REFERENCES "Lead_temperature"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_deposit_id_fkey" FOREIGN KEY ("deposit_id") REFERENCES "Deposits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_client_has_lead_id_fkey" FOREIGN KEY ("client_has_lead_id") REFERENCES "Client_has_lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_client_vehicle_wishlist_id_fkey" FOREIGN KEY ("client_vehicle_wishlist_id") REFERENCES "Client_vehicle_wishlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_client_vehicle_tradein_id_fkey" FOREIGN KEY ("client_vehicle_tradein_id") REFERENCES "Client_vehicle_tradein"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_paymentDate_id_fkey" FOREIGN KEY ("paymentDate_id") REFERENCES "PaymentDate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_amountPerDate_id_fkey" FOREIGN KEY ("amountPerDate_id") REFERENCES "AmountPerDate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_vehicle_delivery_id_fkey" FOREIGN KEY ("vehicle_delivery_id") REFERENCES "Vehicle_delivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_daily_visit_history_id_fkey" FOREIGN KEY ("daily_visit_history_id") REFERENCES "Daily_visit_history"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_wishlist" ADD CONSTRAINT "Client_vehicle_wishlist_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
