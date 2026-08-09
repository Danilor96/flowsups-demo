-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "sales_points_today" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sales_points_today_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sales_points_total" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "seller_activity_counter" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "sms_sent_current_count" INTEGER NOT NULL DEFAULT 0,
    "sms_sent_total_count" INTEGER NOT NULL DEFAULT 0,
    "calls_made_current_count" INTEGER NOT NULL DEFAULT 0,
    "calls_made_total_count" INTEGER NOT NULL DEFAULT 0,
    "emails_sent_current_count" INTEGER NOT NULL DEFAULT 0,
    "emails_sent_total_count" INTEGER NOT NULL DEFAULT 0,
    "appointments_completed_current_count" INTEGER NOT NULL DEFAULT 0,
    "appointments_completed_total_count" INTEGER NOT NULL DEFAULT 0,
    "appointments_made_current_count" INTEGER NOT NULL DEFAULT 0,
    "appointments_made_total_count" INTEGER NOT NULL DEFAULT 0,
    "sold_customers_current_count" INTEGER NOT NULL DEFAULT 0,
    "sold_customers_total_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "seller_activity_counter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seller_activity_counter_sellerId_key" ON "seller_activity_counter"("sellerId");

-- AddForeignKey
ALTER TABLE "seller_activity_counter" ADD CONSTRAINT "seller_activity_counter_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
