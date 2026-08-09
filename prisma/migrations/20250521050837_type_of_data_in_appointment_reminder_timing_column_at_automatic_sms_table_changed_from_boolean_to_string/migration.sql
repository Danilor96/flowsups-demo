-- AlterTable
ALTER TABLE "Automatic_sms" ALTER COLUMN "appointment_reminder_timing" DROP DEFAULT,
ALTER COLUMN "appointment_reminder_timing" SET DATA TYPE TEXT;
