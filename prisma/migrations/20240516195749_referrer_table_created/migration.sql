/*
  Warnings:

  - You are about to drop the column `referrer` on the `Clients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clients" DROP COLUMN "referrer",
ADD COLUMN     "referrer_id" INTEGER;

-- CreateTable
CREATE TABLE "Clients_has_referrer" (
    "id" SERIAL NOT NULL,
    "client_buyer_id" INTEGER NOT NULL,
    "client_referrer_id" INTEGER NOT NULL,

    CONSTRAINT "Clients_has_referrer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clients_has_referrer_client_buyer_id_key" ON "Clients_has_referrer"("client_buyer_id");

-- AddForeignKey
ALTER TABLE "Clients_has_referrer" ADD CONSTRAINT "Clients_has_referrer_client_buyer_id_fkey" FOREIGN KEY ("client_buyer_id") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients_has_referrer" ADD CONSTRAINT "Clients_has_referrer_client_referrer_id_fkey" FOREIGN KEY ("client_referrer_id") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
