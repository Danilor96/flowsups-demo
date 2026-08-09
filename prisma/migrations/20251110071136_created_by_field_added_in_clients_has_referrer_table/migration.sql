/*
  Warnings:

  - Added the required column `created_by` to the `Clients_has_referrer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Clients_has_referrer" DROP CONSTRAINT "Clients_has_referrer_client_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "Clients_has_referrer" DROP CONSTRAINT "Clients_has_referrer_client_referrer_id_fkey";

-- AlterTable
ALTER TABLE "Clients_has_referrer" ADD COLUMN     "created_by" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Clients_has_referrer" ADD CONSTRAINT "Clients_has_referrer_client_buyer_id_fkey" FOREIGN KEY ("client_buyer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients_has_referrer" ADD CONSTRAINT "Clients_has_referrer_client_referrer_id_fkey" FOREIGN KEY ("client_referrer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients_has_referrer" ADD CONSTRAINT "Clients_has_referrer_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
