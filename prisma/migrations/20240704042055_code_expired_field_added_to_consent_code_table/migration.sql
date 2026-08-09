/*
  Warnings:

  - Added the required column `code_expired` to the `Consent_code` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Consent_code" ADD COLUMN     "code_expired" TIMESTAMP(3) NOT NULL;
