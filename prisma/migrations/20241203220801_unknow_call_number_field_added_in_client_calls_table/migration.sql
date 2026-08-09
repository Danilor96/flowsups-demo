-- DropForeignKey
ALTER TABLE "Client_calls" DROP CONSTRAINT "Client_calls_client_id_fkey";

-- AlterTable
ALTER TABLE "Client_calls" ADD COLUMN     "unknow_call_number" TEXT,
ALTER COLUMN "client_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Client_calls" ADD CONSTRAINT "Client_calls_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
