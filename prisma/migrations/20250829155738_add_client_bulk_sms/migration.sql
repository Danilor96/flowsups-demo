-- CreateTable
CREATE TABLE "Client_Bulk_sms" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "date_sent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "sent_by_user_id" INTEGER,
    "total_recipients" INTEGER NOT NULL,
    "successfully_sent" INTEGER NOT NULL,
    "failed_to_send" INTEGER NOT NULL,

    CONSTRAINT "Client_Bulk_sms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client_Bulk_sms" ADD CONSTRAINT "Client_Bulk_sms_sent_by_user_id_fkey" FOREIGN KEY ("sent_by_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
