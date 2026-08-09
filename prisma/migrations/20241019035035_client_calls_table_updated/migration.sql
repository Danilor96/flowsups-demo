/*
  Warnings:

  - Added the required column `call_direction_id` to the `Client_calls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `call_duration` to the `Client_calls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client_calls" ADD COLUMN     "call_direction_id" INTEGER NOT NULL,
ADD COLUMN     "call_duration" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Call_direction" (
    "id" SERIAL NOT NULL,
    "direction" TEXT NOT NULL,

    CONSTRAINT "Call_direction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client_calls" ADD CONSTRAINT "Client_calls_call_direction_id_fkey" FOREIGN KEY ("call_direction_id") REFERENCES "Call_direction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
