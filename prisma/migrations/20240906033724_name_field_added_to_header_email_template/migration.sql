/*
  Warnings:

  - Added the required column `name` to the `Footer_email_template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Header_email_template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Email_template" ALTER COLUMN "published" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Footer_email_template" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Header_email_template" ADD COLUMN     "name" TEXT NOT NULL;
