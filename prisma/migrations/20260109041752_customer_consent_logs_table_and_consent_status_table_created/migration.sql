-- AlterTable
ALTER TABLE "Terms_and_conditions_processed" ADD COLUMN     "customer_consent_logs_id" INTEGER;

-- CreateTable
CREATE TABLE "Customer_consent_logs" (
    "id" SERIAL NOT NULL,
    "phone_number" TEXT NOT NULL,
    "policy_statement" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "consent_status_id" INTEGER NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "timestamp_opt_in" TIMESTAMP(3) NOT NULL,
    "sent_sms_verification_record_id" INTEGER,
    "received_sms_verification_record_id" INTEGER,

    CONSTRAINT "Customer_consent_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Consent_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_consent_logs_customer_id_key" ON "Customer_consent_logs"("customer_id");

-- AddForeignKey
ALTER TABLE "Terms_and_conditions_processed" ADD CONSTRAINT "Terms_and_conditions_processed_customer_consent_logs_id_fkey" FOREIGN KEY ("customer_consent_logs_id") REFERENCES "Customer_consent_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_consent_logs" ADD CONSTRAINT "Customer_consent_logs_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_consent_logs" ADD CONSTRAINT "Customer_consent_logs_consent_status_id_fkey" FOREIGN KEY ("consent_status_id") REFERENCES "Consent_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
