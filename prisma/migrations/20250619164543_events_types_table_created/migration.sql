-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "event_type_id" INTEGER;

-- CreateTable
CREATE TABLE "Events_types" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Events_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "Events_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
