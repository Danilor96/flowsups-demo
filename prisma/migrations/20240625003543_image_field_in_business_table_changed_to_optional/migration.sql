-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "image" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Country_phone_code" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Country_phone_code_pkey" PRIMARY KEY ("id")
);
