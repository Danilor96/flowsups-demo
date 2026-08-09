-- AlterTable
ALTER TABLE "Appointments" ADD COLUMN     "prevented_end_date" TIMESTAMP(3),
ADD COLUMN     "prevented_start_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "appointment_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
