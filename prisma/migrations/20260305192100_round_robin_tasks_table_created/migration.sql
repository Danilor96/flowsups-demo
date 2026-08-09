-- CreateTable
CREATE TABLE "Round_robin_tasks" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,

    CONSTRAINT "Round_robin_tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Round_robin_tasks" ADD CONSTRAINT "Round_robin_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
