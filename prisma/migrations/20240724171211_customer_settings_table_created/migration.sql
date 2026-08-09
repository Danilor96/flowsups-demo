-- CreateTable
CREATE TABLE "Customer_settings" (
    "id" SERIAL NOT NULL,
    "ignore_first_name" BOOLEAN NOT NULL DEFAULT false,
    "active_lost_customer" BOOLEAN NOT NULL DEFAULT false,
    "show_followup" BOOLEAN NOT NULL DEFAULT false,
    "complete_all_open_tasks" BOOLEAN NOT NULL DEFAULT false,
    "lead_lost_after" INTEGER NOT NULL,
    "set_active_lost_customer_status_to" INTEGER NOT NULL,
    "followup_task_visibility" INTEGER NOT NULL,

    CONSTRAINT "Customer_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Followup_task_visibility" (
    "id" SERIAL NOT NULL,
    "followup" TEXT NOT NULL,

    CONSTRAINT "Followup_task_visibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email_forward_incoming_leads" (
    "id" SERIAL NOT NULL,
    "lead" TEXT NOT NULL,

    CONSTRAINT "Email_forward_incoming_leads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Customer_settings" ADD CONSTRAINT "Customer_settings_set_active_lost_customer_status_to_fkey" FOREIGN KEY ("set_active_lost_customer_status_to") REFERENCES "Client_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_settings" ADD CONSTRAINT "Customer_settings_followup_task_visibility_fkey" FOREIGN KEY ("followup_task_visibility") REFERENCES "Followup_task_visibility"("id") ON DELETE CASCADE ON UPDATE CASCADE;
