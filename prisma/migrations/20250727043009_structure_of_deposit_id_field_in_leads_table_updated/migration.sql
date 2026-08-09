/*
  Warnings:

  - The `deposit_id` column on the `Leads` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `client_has_lead_id` column on the `Leads` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Leads" DROP CONSTRAINT "Leads_client_has_lead_id_fkey";

-- DropForeignKey
ALTER TABLE "Leads" DROP CONSTRAINT "Leads_deposit_id_fkey";

-- AlterTable
ALTER TABLE "Leads" DROP COLUMN "deposit_id",
ADD COLUMN     "deposit_id" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
DROP COLUMN "client_has_lead_id",
ADD COLUMN     "client_has_lead_id" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
