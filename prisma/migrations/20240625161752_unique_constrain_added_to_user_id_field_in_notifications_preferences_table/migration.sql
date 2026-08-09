/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Notifications_preferences` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notifications_preferences_user_id_key" ON "Notifications_preferences"("user_id");
