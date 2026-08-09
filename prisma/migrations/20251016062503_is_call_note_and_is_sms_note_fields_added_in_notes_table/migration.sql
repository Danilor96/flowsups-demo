-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "is_call_note" BOOLEAN DEFAULT false,
ADD COLUMN     "is_sms_note" BOOLEAN DEFAULT false;
