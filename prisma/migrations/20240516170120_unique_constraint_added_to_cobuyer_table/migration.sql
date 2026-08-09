/*
  Warnings:

  - A unique constraint covering the columns `[buyer_client_id]` on the table `Client_has_cobuyer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_has_cobuyer_buyer_client_id_key" ON "Client_has_cobuyer"("buyer_client_id");
