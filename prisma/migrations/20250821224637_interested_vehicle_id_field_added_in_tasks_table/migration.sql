-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "interested_vehicle_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_interested_vehicle_id_fkey" FOREIGN KEY ("interested_vehicle_id") REFERENCES "Vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
