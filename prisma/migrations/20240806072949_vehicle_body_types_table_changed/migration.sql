/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Vehicle_body_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_body_types_type_key" ON "Vehicle_body_types"("type");
