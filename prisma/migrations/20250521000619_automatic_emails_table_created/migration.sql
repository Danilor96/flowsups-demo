-- CreateTable
CREATE TABLE "Automatic_emails" (
    "id" SERIAL NOT NULL,
    "internet_lead_auto_response" BOOLEAN NOT NULL DEFAULT false,
    "appointment_reminder" BOOLEAN NOT NULL DEFAULT false,
    "appointment_reminder_days" TEXT NOT NULL,
    "appointment_scheduled_on_site" BOOLEAN NOT NULL DEFAULT false,
    "appointment_rescheduled_on_site" BOOLEAN NOT NULL DEFAULT false,
    "appointment_scheduled_online" BOOLEAN NOT NULL DEFAULT false,
    "appointment_rescheduled_online" BOOLEAN NOT NULL DEFAULT false,
    "sold_deals_thank_you" BOOLEAN NOT NULL DEFAULT false,
    "sold_deals_thank_you_days" TEXT NOT NULL,
    "vehicle_price_drop" BOOLEAN NOT NULL DEFAULT false,
    "customer_status_id" INTEGER NOT NULL,
    "deposit_payment_receipt" BOOLEAN NOT NULL DEFAULT false,
    "deposit_payment_receipt_send_immediately_id" INTEGER NOT NULL,
    "stipulation_request" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Automatic_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment_types" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Payment_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_customer_status_id_fkey" FOREIGN KEY ("customer_status_id") REFERENCES "Client_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_deposit_payment_receipt_send_immediately__fkey" FOREIGN KEY ("deposit_payment_receipt_send_immediately_id") REFERENCES "Payment_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
