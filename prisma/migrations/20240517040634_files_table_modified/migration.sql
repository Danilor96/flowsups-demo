/*
  Warnings:

  - Added the required column `stipulation` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploaded_by` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploaded_on` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "stipulation" TEXT NOT NULL,
ADD COLUMN     "uploaded_by" INTEGER NOT NULL,
ADD COLUMN     "uploaded_on" TIMESTAMP(3) NOT NULL;
