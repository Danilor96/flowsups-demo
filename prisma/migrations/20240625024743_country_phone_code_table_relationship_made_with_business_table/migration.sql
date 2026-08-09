/*
  Warnings:

  - Added the required column `country_phone_code_id` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "country_phone_code_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_country_phone_code_id_fkey" FOREIGN KEY ("country_phone_code_id") REFERENCES "Country_phone_code"("id") ON DELETE CASCADE ON UPDATE CASCADE;
