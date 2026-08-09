/*
  Warnings:

  - Added the required column `call_date` to the `Client_calls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `call_status_id` to the `Client_calls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client_calls" ADD COLUMN     "call_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "call_status_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Call_statuses" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Call_statuses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client_calls" ADD CONSTRAINT "Client_calls_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_calls" ADD CONSTRAINT "Client_calls_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_calls" ADD CONSTRAINT "Client_calls_call_status_id_fkey" FOREIGN KEY ("call_status_id") REFERENCES "Call_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
