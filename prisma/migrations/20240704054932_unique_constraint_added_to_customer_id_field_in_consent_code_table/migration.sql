/*
  Warnings:

  - A unique constraint covering the columns `[customer_id]` on the table `Consent_code` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Consent_code_customer_id_key" ON "Consent_code"("customer_id");
