-- CreateTable
CREATE TABLE "Vehicle_delivery" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "assigned_to" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "reminder_time" TIMESTAMP(3) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_delivery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle_delivery" ADD CONSTRAINT "Vehicle_delivery_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_delivery" ADD CONSTRAINT "Vehicle_delivery_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_delivery" ADD CONSTRAINT "Vehicle_delivery_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_delivery" ADD CONSTRAINT "Vehicle_delivery_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
