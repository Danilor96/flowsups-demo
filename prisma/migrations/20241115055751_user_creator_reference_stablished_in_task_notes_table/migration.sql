-- AddForeignKey
ALTER TABLE "Task_Notes" ADD CONSTRAINT "Task_Notes_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
