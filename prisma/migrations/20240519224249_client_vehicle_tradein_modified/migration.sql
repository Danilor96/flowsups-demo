/*
  Warnings:

  - Added the required column `client_id` to the `Client_vehicle_tradein` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client_vehicle_tradein" ADD COLUMN     "client_id" INTEGER NOT NULL,
ALTER COLUMN "book_value" DROP NOT NULL,
ALTER COLUMN "trade_allowance" DROP NOT NULL,
ALTER COLUMN "trade_payoff" DROP NOT NULL,
ALTER COLUMN "comment_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
