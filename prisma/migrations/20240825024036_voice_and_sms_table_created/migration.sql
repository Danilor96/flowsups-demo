-- CreateTable
CREATE TABLE "Incoming_calls_options" (
    "id" SERIAL NOT NULL,
    "option" TEXT NOT NULL,

    CONSTRAINT "Incoming_calls_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email_name_displayed" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Email_name_displayed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sms_limit_warning_recipients" (
    "id" SERIAL NOT NULL,
    "recipient" TEXT NOT NULL,

    CONSTRAINT "Sms_limit_warning_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voice_and_sms" (
    "id" SERIAL NOT NULL,
    "system_phone_for_publishing" TEXT,
    "system_email_address_for_publishing" TEXT,
    "email_verfified" BOOLEAN NOT NULL DEFAULT false,
    "forward_incoming_calls_to" TEXT,
    "forward_incoming_calls_option_id" INTEGER NOT NULL,
    "dealership_phone_number" BOOLEAN NOT NULL DEFAULT false,
    "disable_auto_emails_to_customer" BOOLEAN NOT NULL DEFAULT false,
    "disable_sending_auto_sms_over_montly_limit" BOOLEAN NOT NULL DEFAULT false,
    "for_buying_vehicles_from_customers" BOOLEAN NOT NULL DEFAULT false,
    "in_spanish" BOOLEAN NOT NULL DEFAULT false,
    "include_dealership_address" BOOLEAN NOT NULL DEFAULT false,
    "email_name_displayed_id" INTEGER NOT NULL,
    "sms_limit_warning_recipients_id" INTEGER,

    CONSTRAINT "Voice_and_sms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Voice_and_sms" ADD CONSTRAINT "Voice_and_sms_sms_limit_warning_recipients_id_fkey" FOREIGN KEY ("sms_limit_warning_recipients_id") REFERENCES "Sms_limit_warning_recipients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voice_and_sms" ADD CONSTRAINT "Voice_and_sms_email_name_displayed_id_fkey" FOREIGN KEY ("email_name_displayed_id") REFERENCES "Email_name_displayed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voice_and_sms" ADD CONSTRAINT "Voice_and_sms_forward_incoming_calls_option_id_fkey" FOREIGN KEY ("forward_incoming_calls_option_id") REFERENCES "Incoming_calls_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
