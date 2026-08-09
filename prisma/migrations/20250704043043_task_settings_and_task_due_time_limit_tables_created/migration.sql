-- CreateTable
CREATE TABLE "Task_settings" (
    "id" SERIAL NOT NULL,
    "first_span_limit_id" INTEGER,
    "second_span_limit_id" INTEGER,
    "third_span_limit_id" INTEGER,

    CONSTRAINT "Task_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task_due_time_limit" (
    "id" SERIAL NOT NULL,
    "span" TEXT NOT NULL,

    CONSTRAINT "Task_due_time_limit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task_settings" ADD CONSTRAINT "Task_settings_first_span_limit_id_fkey" FOREIGN KEY ("first_span_limit_id") REFERENCES "Task_due_time_limit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task_settings" ADD CONSTRAINT "Task_settings_second_span_limit_id_fkey" FOREIGN KEY ("second_span_limit_id") REFERENCES "Task_due_time_limit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task_settings" ADD CONSTRAINT "Task_settings_third_span_limit_id_fkey" FOREIGN KEY ("third_span_limit_id") REFERENCES "Task_due_time_limit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
