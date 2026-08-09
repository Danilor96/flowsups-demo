/*
  Warnings:

  - A unique constraint covering the columns `[conference_name]` on the table `Conferences_names` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conferences_names_conference_name_key" ON "Conferences_names"("conference_name");
