-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "appointment_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
