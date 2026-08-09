/*
  Warnings:

  - A unique constraint covering the columns `[appointment_id]` on the table `Notifications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[appointment_id]` on the table `Tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notifications_appointment_id_key" ON "Notifications"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tasks_appointment_id_key" ON "Tasks"("appointment_id");
