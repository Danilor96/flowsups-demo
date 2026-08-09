-- AlterTable
ALTER TABLE "Automatic_sms" ADD COLUMN     "appointment_reminder_template_id" INTEGER,
ADD COLUMN     "appointment_reschedule_onSite_template_id" INTEGER,
ADD COLUMN     "appointment_reschedule_online_template_id" INTEGER,
ADD COLUMN     "appointment_schedule_on_site_template_id" INTEGER,
ADD COLUMN     "appointment_schedule_online_template_id" INTEGER,
ADD COLUMN     "stipulation_request_template_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_appointment_reminder_template_id_fkey" FOREIGN KEY ("appointment_reminder_template_id") REFERENCES "Sms_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_appointment_schedule_on_site_template_id_fkey" FOREIGN KEY ("appointment_schedule_on_site_template_id") REFERENCES "Sms_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_appointment_schedule_online_template_id_fkey" FOREIGN KEY ("appointment_schedule_online_template_id") REFERENCES "Sms_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_appointment_reschedule_onSite_template_id_fkey" FOREIGN KEY ("appointment_reschedule_onSite_template_id") REFERENCES "Sms_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_appointment_reschedule_online_template_id_fkey" FOREIGN KEY ("appointment_reschedule_online_template_id") REFERENCES "Sms_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_stipulation_request_template_id_fkey" FOREIGN KEY ("stipulation_request_template_id") REFERENCES "Sms_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
