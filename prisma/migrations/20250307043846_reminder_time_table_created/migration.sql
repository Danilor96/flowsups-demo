/*
  Warnings:

  - The `reminder_time` column on the `Client_has_lead` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Client_has_lead" DROP COLUMN "reminder_time",
ADD COLUMN     "reminder_time" INTEGER DEFAULT NULL;

-- CreateTable
CREATE TABLE "ReminderTime" (
    "id" SERIAL NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "ReminderTime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client_has_lead" ADD CONSTRAINT "Client_has_lead_reminder_time_fkey" FOREIGN KEY ("reminder_time") REFERENCES "ReminderTime"("id") ON DELETE CASCADE ON UPDATE CASCADE;
