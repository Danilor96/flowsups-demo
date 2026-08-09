/*
  Warnings:

  - Added the required column `customer_id` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadline` to the `Tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_assigned_to_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_created_by_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_status_fkey";

-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "customer_id" INTEGER NOT NULL,
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_status_fkey" FOREIGN KEY ("status") REFERENCES "Task_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
