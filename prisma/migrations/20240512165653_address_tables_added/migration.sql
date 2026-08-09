/*
  Warnings:

  - Added the required column `client_address_id` to the `Clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "client_address_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "States" (
    "id" SERIAL NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "States_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zip_code" (
    "id" SERIAL NOT NULL,
    "zip" TEXT NOT NULL,

    CONSTRAINT "Zip_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "County" (
    "id" SERIAL NOT NULL,
    "county" TEXT NOT NULL,

    CONSTRAINT "County_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client_address" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "state_id" INTEGER NOT NULL,
    "zip_id" INTEGER,
    "county_id" INTEGER,

    CONSTRAINT "Client_address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client_address" ADD CONSTRAINT "Client_address_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "States"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_address" ADD CONSTRAINT "Client_address_zip_id_fkey" FOREIGN KEY ("zip_id") REFERENCES "Zip_code"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_address" ADD CONSTRAINT "Client_address_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "County"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_client_address_id_fkey" FOREIGN KEY ("client_address_id") REFERENCES "Client_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
