-- AlterTable
ALTER TABLE "Client_sms" ADD COLUMN     "unregistered_customer_id" INTEGER,
ALTER COLUMN "client_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Client_sms" ADD CONSTRAINT "Client_sms_unregistered_customer_id_fkey" FOREIGN KEY ("unregistered_customer_id") REFERENCES "Awaiting_unknow_client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
