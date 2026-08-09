-- AlterTable
ALTER TABLE "Automatic_emails" ADD COLUMN     "appointment_confirmation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "appointment_confirmation_template_id" INTEGER,
ADD COLUMN     "consent_sms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consent_sms_template_id" INTEGER;

-- AlterTable
ALTER TABLE "Automatic_sms" ADD COLUMN     "appointment_confirmation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "appointment_confirmation_template_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_consent_sms_template_id_fkey" FOREIGN KEY ("consent_sms_template_id") REFERENCES "Email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_appointment_confirmation_template_id_fkey" FOREIGN KEY ("appointment_confirmation_template_id") REFERENCES "Email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_appointment_confirmation_template_id_fkey" FOREIGN KEY ("appointment_confirmation_template_id") REFERENCES "Sms_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
