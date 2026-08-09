/*
  Warnings:

  - You are about to drop the column `active` on the `Notifications_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `notification` on the `Notifications_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `type_id` on the `Notifications_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Notifications_preferences` table. All the data in the column will be lost.
  - You are about to drop the `Notifications_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notifications_preferences" DROP CONSTRAINT "Notifications_preferences_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Notifications_preferences" DROP CONSTRAINT "Notifications_preferences_user_id_fkey";

-- AlterTable
ALTER TABLE "Notifications_preferences" DROP COLUMN "active",
DROP COLUMN "notification",
DROP COLUMN "type_id",
DROP COLUMN "user_id",
ADD COLUMN     "event_type_id" INTEGER,
ADD COLUMN     "user_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- DropTable
DROP TABLE "Notifications_types";

-- AddForeignKey
ALTER TABLE "Notifications_preferences" ADD CONSTRAINT "Notifications_preferences_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "Events_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
