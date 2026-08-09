/*
  Warnings:

  - Added the required column `created_by` to the `Appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointments" ADD COLUMN     "created_by" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
