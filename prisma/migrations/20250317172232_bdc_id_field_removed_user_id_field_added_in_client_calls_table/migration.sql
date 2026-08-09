/*
  Warnings:

  - You are about to drop the column `bdc_id` on the `Client_calls` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `Client_calls` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client_calls" DROP CONSTRAINT "Client_calls_seller_id_fkey";

-- AlterTable
ALTER TABLE "Client_calls" DROP COLUMN "bdc_id",
DROP COLUMN "seller_id",
ADD COLUMN     "user_id" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- CreateTable
CREATE TABLE "_Client_callsToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Client_callsToUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Client_callsToUsers_B_index" ON "_Client_callsToUsers"("B");

-- AddForeignKey
ALTER TABLE "_Client_callsToUsers" ADD CONSTRAINT "_Client_callsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Client_calls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Client_callsToUsers" ADD CONSTRAINT "_Client_callsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
