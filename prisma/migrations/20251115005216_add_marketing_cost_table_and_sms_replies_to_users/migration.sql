-- AlterTable
ALTER TABLE "Client_sms" ADD COLUMN     "is_reply_to_user" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "replied_to_user_id" INTEGER,
ADD COLUMN     "sender_user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Client_sms" ADD CONSTRAINT "Client_sms_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_sms" ADD CONSTRAINT "Client_sms_replied_to_user_id_fkey" FOREIGN KEY ("replied_to_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
