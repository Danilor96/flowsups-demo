/*
  Warnings:

  - You are about to drop the `Template_category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sms_template" DROP CONSTRAINT "Sms_template_category_id_fkey";

-- DropTable
DROP TABLE "Template_category";

-- AddForeignKey
ALTER TABLE "Sms_template" ADD CONSTRAINT "Sms_template_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Sms_template_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
