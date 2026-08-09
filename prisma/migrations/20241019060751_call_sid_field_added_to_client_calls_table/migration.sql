/*
  Warnings:

  - A unique constraint covering the columns `[call_sid]` on the table `Client_calls` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `call_sid` to the `Client_calls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client_calls" ADD COLUMN     "call_sid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Client_calls_call_sid_key" ON "Client_calls"("call_sid");
