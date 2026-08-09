-- AlterTable
ALTER TABLE "Appointments" ADD COLUMN     "reminder_time_id" INTEGER;

-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "reminder_sent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reminder_time_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_reminder_time_id_fkey" FOREIGN KEY ("reminder_time_id") REFERENCES "ReminderTime"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_reminder_time_id_fkey" FOREIGN KEY ("reminder_time_id") REFERENCES "ReminderTime"("id") ON DELETE SET NULL ON UPDATE CASCADE;
