/*
  Warnings:

  - You are about to drop the column `contact_time` on the `Clients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clients" DROP COLUMN "contact_time",
ADD COLUMN     "contact_time_id" INTEGER;

-- CreateTable
CREATE TABLE "Contact_time" (
    "id" SERIAL NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "Contact_time_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_contact_time_id_fkey" FOREIGN KEY ("contact_time_id") REFERENCES "Contact_time"("id") ON DELETE CASCADE ON UPDATE CASCADE;
