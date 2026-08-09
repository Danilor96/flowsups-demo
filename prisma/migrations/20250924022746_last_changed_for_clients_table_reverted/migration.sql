/*
  Warnings:

  - Made the column `current_address` on table `Clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `client_address_id` on table `Clients` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_client_address_id_fkey";

-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "current_address" SET NOT NULL,
ALTER COLUMN "client_address_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_client_address_id_fkey" FOREIGN KEY ("client_address_id") REFERENCES "Client_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
