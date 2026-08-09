/*
  Warnings:

  - A unique constraint covering the columns `[customer_id]` on the table `Terms_and_conditions_processed` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Terms_and_conditions_processed_customer_id_key" ON "Terms_and_conditions_processed"("customer_id");
