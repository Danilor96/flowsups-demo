/*
  Warnings:

  - You are about to drop the column `mailing_state` on the `Credit_app_address` table. All the data in the column will be lost.
  - The `mailing_state_id` column on the `Credit_app_address` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `prev_state` on the `Credit_app_address_prev` table. All the data in the column will be lost.
  - The `prev_state_id` column on the `Credit_app_address_prev` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Credit_app_address" DROP COLUMN "mailing_state",
DROP COLUMN "mailing_state_id",
ADD COLUMN     "mailing_state_id" INTEGER;

-- AlterTable
ALTER TABLE "Credit_app_address_prev" DROP COLUMN "prev_state",
DROP COLUMN "prev_state_id",
ADD COLUMN     "prev_state_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Credit_app_address" ADD CONSTRAINT "Credit_app_address_mailing_state_id_fkey" FOREIGN KEY ("mailing_state_id") REFERENCES "States"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address_prev" ADD CONSTRAINT "Credit_app_address_prev_prev_state_id_fkey" FOREIGN KEY ("prev_state_id") REFERENCES "States"("id") ON DELETE CASCADE ON UPDATE CASCADE;
