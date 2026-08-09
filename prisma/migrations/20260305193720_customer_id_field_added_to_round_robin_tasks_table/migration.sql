/*
  Warnings:

  - A unique constraint covering the columns `[customer_id]` on the table `Round_robin_tasks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customer_id` to the `Round_robin_tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Round_robin_tasks" ADD COLUMN     "customer_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Round_robin_tasks_customer_id_key" ON "Round_robin_tasks"("customer_id");
