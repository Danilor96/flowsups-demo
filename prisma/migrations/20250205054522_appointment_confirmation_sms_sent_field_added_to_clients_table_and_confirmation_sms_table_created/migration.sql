-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "appointment_confirmation_sms_sent" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "ConfirmationSms" (
    "id" SERIAL NOT NULL,
    "sms" TEXT NOT NULL,

    CONSTRAINT "ConfirmationSms_pkey" PRIMARY KEY ("id")
);
