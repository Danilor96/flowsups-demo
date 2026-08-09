-- CreateTable
CREATE TABLE "Daily_visit_history" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "sales_rep_id" INTEGER NOT NULL,
    "lead_type_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "trade" BOOLEAN NOT NULL DEFAULT false,
    "assigned_manager_id" INTEGER NOT NULL,
    "location_id" INTEGER,
    "decision_id" INTEGER NOT NULL,

    CONSTRAINT "Daily_visit_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Daily_visit_history" ADD CONSTRAINT "Daily_visit_history_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daily_visit_history" ADD CONSTRAINT "Daily_visit_history_sales_rep_id_fkey" FOREIGN KEY ("sales_rep_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daily_visit_history" ADD CONSTRAINT "Daily_visit_history_lead_type_id_fkey" FOREIGN KEY ("lead_type_id") REFERENCES "Lead_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daily_visit_history" ADD CONSTRAINT "Daily_visit_history_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daily_visit_history" ADD CONSTRAINT "Daily_visit_history_assigned_manager_id_fkey" FOREIGN KEY ("assigned_manager_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daily_visit_history" ADD CONSTRAINT "Daily_visit_history_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "Client_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
