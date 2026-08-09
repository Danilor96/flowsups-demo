-- CreateTable
CREATE TABLE "sales_goals_config" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "monthly_sales_goal" INTEGER,
    "daily_sales_points_target" INTEGER,
    "emails_sent_number" INTEGER,
    "smss_sent_number" INTEGER,
    "calls_made_number" INTEGER,
    "appointments_completed_number" INTEGER,
    "appointments_made_number" INTEGER,
    "sold_customers_number" INTEGER,

    CONSTRAINT "sales_goals_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sales_goals_config_business_id_key" ON "sales_goals_config"("business_id");

-- AddForeignKey
ALTER TABLE "sales_goals_config" ADD CONSTRAINT "sales_goals_config_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
