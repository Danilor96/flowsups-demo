-- AlterTable
ALTER TABLE "Client_has_lead" ADD COLUMN     "task_id" INTEGER;

-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "task_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Client_has_lead" ADD CONSTRAINT "Client_has_lead_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
