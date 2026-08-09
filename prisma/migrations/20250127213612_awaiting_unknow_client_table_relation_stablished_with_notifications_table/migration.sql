-- AlterTable
ALTER TABLE "Client_sms" ADD COLUMN     "fileAttachment" JSONB;

-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "unregistered_customer_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_unregistered_customer_id_fkey" FOREIGN KEY ("unregistered_customer_id") REFERENCES "Awaiting_unknow_client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
