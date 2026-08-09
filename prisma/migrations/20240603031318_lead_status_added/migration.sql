/*
  Warnings:

  - Added the required column `status_id` to the `Client_has_lead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client_has_lead" ADD COLUMN     "status_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Lead_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Lead_status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client_has_lead" ADD CONSTRAINT "Client_has_lead_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Lead_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
