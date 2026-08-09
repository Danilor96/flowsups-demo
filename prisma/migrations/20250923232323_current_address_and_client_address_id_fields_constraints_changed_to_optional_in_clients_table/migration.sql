-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_client_address_id_fkey";

-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "current_address" DROP NOT NULL,
ALTER COLUMN "client_address_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_client_address_id_fkey" FOREIGN KEY ("client_address_id") REFERENCES "Client_address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
