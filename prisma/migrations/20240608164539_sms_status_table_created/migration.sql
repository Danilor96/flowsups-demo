/*
  Warnings:

  - Added the required column `status_id` to the `Client_sms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client_sms" ADD COLUMN     "status_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "completed_by" INTEGER;

-- CreateTable
CREATE TABLE "Sms_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Sms_status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_sms" ADD CONSTRAINT "Client_sms_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Sms_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
