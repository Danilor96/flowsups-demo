/*
  Warnings:

  - A unique constraint covering the columns `[event_type_id]` on the table `Notifications_preferences` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notifications_preferences_event_type_id_key" ON "Notifications_preferences"("event_type_id");
