/*
  Warnings:

  - You are about to drop the column `zip_id` on the `Client_address` table. All the data in the column will be lost.
  - You are about to drop the `Zip_code` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client_address" DROP CONSTRAINT "Client_address_zip_id_fkey";

-- AlterTable
ALTER TABLE "Client_address" DROP COLUMN "zip_id",
ADD COLUMN     "zip" TEXT;

-- DropTable
DROP TABLE "Zip_code";
