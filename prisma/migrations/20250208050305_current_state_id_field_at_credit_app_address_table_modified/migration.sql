/*
  Warnings:

  - You are about to drop the column `current_state` on the `Credit_app_address` table. All the data in the column will be lost.
  - The `current_state_id` column on the `Credit_app_address` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Credit_app_address" DROP COLUMN "current_state",
DROP COLUMN "current_state_id",
ADD COLUMN     "current_state_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Credit_app_address" ADD CONSTRAINT "Credit_app_address_current_state_id_fkey" FOREIGN KEY ("current_state_id") REFERENCES "States"("id") ON DELETE CASCADE ON UPDATE CASCADE;
