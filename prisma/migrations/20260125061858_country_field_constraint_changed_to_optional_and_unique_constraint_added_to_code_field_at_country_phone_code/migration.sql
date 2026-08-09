/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Country_phone_code` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Country_phone_code" ALTER COLUMN "country" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Country_phone_code_code_key" ON "Country_phone_code"("code");
