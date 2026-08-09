-- AlterTable
ALTER TABLE "Client_has_lead" ADD COLUMN     "lead_temperature_id" INTEGER;

-- CreateTable
CREATE TABLE "Lead_temperature" (
    "id" SERIAL NOT NULL,
    "temperature" INTEGER NOT NULL,

    CONSTRAINT "Lead_temperature_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client_has_lead" ADD CONSTRAINT "Client_has_lead_lead_temperature_id_fkey" FOREIGN KEY ("lead_temperature_id") REFERENCES "Lead_temperature"("id") ON DELETE SET NULL ON UPDATE CASCADE;
