-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "is_Mailing_Address_Same_As_Physical" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "mailling_address" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "full_address" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state_id" INTEGER NOT NULL,
    "zip" TEXT,
    "county" TEXT,
    "county_code" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_business_id_key" ON "Address"("business_id");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "States"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
