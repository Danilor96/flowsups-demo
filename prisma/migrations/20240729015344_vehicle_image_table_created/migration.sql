/*
  Warnings:

  - Added the required column `image_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicles" ADD COLUMN     "image_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Vehicle_image" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "Vehicle_image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Vehicle_image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
