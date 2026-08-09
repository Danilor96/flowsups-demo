-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "notification_for_managers" BOOLEAN,
ALTER COLUMN "user_id" DROP NOT NULL;
