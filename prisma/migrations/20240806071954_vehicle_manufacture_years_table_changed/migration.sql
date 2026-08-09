/*
  Warnings:

  - A unique constraint covering the columns `[year]` on the table `Vehicle_manufacture_years` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_manufacture_years_year_key" ON "Vehicle_manufacture_years"("year");
