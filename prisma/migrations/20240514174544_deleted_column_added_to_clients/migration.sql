/*
  Warnings:

  - A unique constraint covering the columns `[mobile_phone]` on the table `Clients` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "deleted" BOOLEAN;

-- CreateTable
CREATE TABLE "Client_calls" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "seller_id" INTEGER NOT NULL,

    CONSTRAINT "Client_calls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clients_mobile_phone_key" ON "Clients"("mobile_phone");
