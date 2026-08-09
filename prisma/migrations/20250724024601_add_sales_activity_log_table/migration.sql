-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('SMS_SENT', 'EMAIL_SENT', 'CALL_MADE', 'APPOINTMENT_COMPLETED', 'APPOINTMENT_MADE', 'CUSTOMER_SOLD');

-- CreateTable
CREATE TABLE "Sales_activity_log" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "activity_type" "ActivityType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sales_activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sales_activity_log_created_at_idx" ON "Sales_activity_log"("created_at");

-- AddForeignKey
ALTER TABLE "Sales_activity_log" ADD CONSTRAINT "Sales_activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
