/*
  Warnings:

  - A unique constraint covering the columns `[sent_sms_verification_record_id]` on the table `Customer_consent_logs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[received_sms_verification_record_id]` on the table `Customer_consent_logs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer_consent_logs_sent_sms_verification_record_id_key" ON "Customer_consent_logs"("sent_sms_verification_record_id");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_consent_logs_received_sms_verification_record_id_key" ON "Customer_consent_logs"("received_sms_verification_record_id");

-- AddForeignKey
ALTER TABLE "Customer_consent_logs" ADD CONSTRAINT "Customer_consent_logs_sent_sms_verification_record_id_fkey" FOREIGN KEY ("sent_sms_verification_record_id") REFERENCES "Client_sms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_consent_logs" ADD CONSTRAINT "Customer_consent_logs_received_sms_verification_record_id_fkey" FOREIGN KEY ("received_sms_verification_record_id") REFERENCES "Client_sms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
