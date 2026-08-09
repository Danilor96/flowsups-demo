/*
  Warnings:

  - Added the required column `user_id` to the `Notifications_preferences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notifications_preferences" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Notifications_preferences" ADD CONSTRAINT "Notifications_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
