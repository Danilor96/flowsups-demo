/*
  Warnings:

  - You are about to drop the column `sms_limit_warning_recipients_id` on the `Voice_and_sms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Voice_and_sms" DROP CONSTRAINT "Voice_and_sms_sms_limit_warning_recipients_id_fkey";

-- AlterTable
ALTER TABLE "Vehicles" ALTER COLUMN "image_id" DROP NOT NULL,
ALTER COLUMN "key_info_id" DROP NOT NULL,
ALTER COLUMN "title_license_id" DROP NOT NULL,
ALTER COLUMN "vehicle_purchase_info_id" DROP NOT NULL,
ALTER COLUMN "vehicle_general_info_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Voice_and_sms" DROP COLUMN "sms_limit_warning_recipients_id";
