-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "country_phone_code_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_country_phone_code_id_fkey" FOREIGN KEY ("country_phone_code_id") REFERENCES "Country_phone_code"("id") ON DELETE CASCADE ON UPDATE CASCADE;
