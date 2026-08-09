/*
  Warnings:

  - You are about to drop the `Email_to_deal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Email_to_deal";

-- CreateTable
CREATE TABLE "Email_to_lead" (
    "id" SERIAL NOT NULL,
    "lead" TEXT NOT NULL,

    CONSTRAINT "Email_to_lead_pkey" PRIMARY KEY ("id")
);
