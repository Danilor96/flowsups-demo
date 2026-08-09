/*
  Warnings:

  - A unique constraint covering the columns `[client_id]` on the table `Credit_app` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Credit_app_client_id_key" ON "Credit_app"("client_id");
