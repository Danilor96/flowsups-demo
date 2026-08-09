-- AlterTable
ALTER TABLE "Events_types" ADD COLUMN     "category_id" INTEGER;

-- CreateTable
CREATE TABLE "Event_category" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Event_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Events_types" ADD CONSTRAINT "Events_types_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Event_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
