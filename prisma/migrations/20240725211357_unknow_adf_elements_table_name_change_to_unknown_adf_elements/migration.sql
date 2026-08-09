/*
  Warnings:

  - You are about to drop the `Unknow_adf_elements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Unknow_adf_elements";

-- CreateTable
CREATE TABLE "Unknown_adf_elements" (
    "id" SERIAL NOT NULL,
    "element" TEXT NOT NULL,

    CONSTRAINT "Unknown_adf_elements_pkey" PRIMARY KEY ("id")
);
