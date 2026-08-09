-- CreateTable
CREATE TABLE "Business_phone_numbers" (
    "id" SERIAL NOT NULL,
    "twilio_sid" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "friendly_name" TEXT NOT NULL,
    "business_id" INTEGER,

    CONSTRAINT "Business_phone_numbers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Business_phone_numbers" ADD CONSTRAINT "Business_phone_numbers_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;
