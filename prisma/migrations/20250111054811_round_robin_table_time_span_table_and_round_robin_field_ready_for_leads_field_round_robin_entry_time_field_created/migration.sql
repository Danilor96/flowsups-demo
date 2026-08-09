/*
  Warnings:

  - You are about to drop the column `end_suspension_dat` on the `Suspension` table. All the data in the column will be lost.
  - You are about to drop the `Appointment_sms` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `end_suspension_date` to the `Suspension` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Suspension" DROP COLUMN "end_suspension_dat",
ADD COLUMN     "end_suspension_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "ready_for_leads" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "round_robin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "round_robin_entry_time" TIMESTAMP(3);

-- DropTable
DROP TABLE "Appointment_sms";

-- CreateTable
CREATE TABLE "AppointmentSms" (
    "id" SERIAL NOT NULL,
    "sms" TEXT NOT NULL,

    CONSTRAINT "AppointmentSms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Time_span" (
    "id" SERIAL NOT NULL,
    "time_span" TEXT NOT NULL,

    CONSTRAINT "Time_span_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round_robin" (
    "id" SERIAL NOT NULL,
    "ready_for_leads" BOOLEAN NOT NULL DEFAULT false,
    "automatic_reassign_leads" BOOLEAN NOT NULL DEFAULT false,
    "span_time_id" INTEGER,
    "avoid_automatic_reassign_olders_leads" BOOLEAN NOT NULL DEFAULT false,
    "days_until_avoid" INTEGER,
    "assign_leads_during_store_hours" BOOLEAN NOT NULL DEFAULT false,
    "assign_leads_during_shift_hours" BOOLEAN NOT NULL DEFAULT false,
    "users_must_activate_ready_for_leads" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Round_robin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Round_robin" ADD CONSTRAINT "Round_robin_span_time_id_fkey" FOREIGN KEY ("span_time_id") REFERENCES "Time_span"("id") ON DELETE SET NULL ON UPDATE CASCADE;
