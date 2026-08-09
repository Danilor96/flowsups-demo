/*
  Warnings:

  - Added the required column `task_id` to the `Task_Notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task_Notes" ADD COLUMN     "task_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Task_Notes" ADD CONSTRAINT "Task_Notes_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
