/*
  Warnings:

  - Added the required column `comment_id` to the `Client_vehicle_tradein` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client_vehicle_tradein" ADD COLUMN     "comment_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Vehicle_tradein_comments" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "Vehicle_tradein_comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Vehicle_tradein_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
