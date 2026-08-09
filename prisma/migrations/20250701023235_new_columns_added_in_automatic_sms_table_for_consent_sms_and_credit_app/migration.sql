-- AlterTable
ALTER TABLE "Automatic_sms" ADD COLUMN     "consent_sms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consent_sms_template_id" INTEGER,
ADD COLUMN     "credit_app" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "credit_app_template_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_consent_sms_template_id_fkey" FOREIGN KEY ("consent_sms_template_id") REFERENCES "Sms_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_credit_app_template_id_fkey" FOREIGN KEY ("credit_app_template_id") REFERENCES "Sms_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
