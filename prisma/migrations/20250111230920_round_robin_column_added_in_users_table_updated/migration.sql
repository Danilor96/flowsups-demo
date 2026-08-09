/*
  Warnings:

  - You are about to drop the column `round_robin_entry_time` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "round_robin_entry_time",
ADD COLUMN     "round_robin_order" INTEGER;
