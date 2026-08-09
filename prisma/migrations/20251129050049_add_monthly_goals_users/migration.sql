-- CreateTable
CREATE TABLE "Monthly_goals" (
    "id" SERIAL NOT NULL,
    "sales_goal" INTEGER NOT NULL,
    "date_month" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "business_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Monthly_goals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Monthly_goals" ADD CONSTRAINT "Monthly_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monthly_goals" ADD CONSTRAINT "Monthly_goals_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
