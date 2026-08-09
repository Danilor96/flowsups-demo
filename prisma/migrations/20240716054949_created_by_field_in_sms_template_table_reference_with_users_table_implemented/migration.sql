-- AddForeignKey
ALTER TABLE "Sms_template" ADD CONSTRAINT "Sms_template_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
