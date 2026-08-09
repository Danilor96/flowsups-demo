/*
  Warnings:

  - You are about to drop the `Clients_has_languages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Clients_has_languages" DROP CONSTRAINT "Clients_has_languages_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Clients_has_languages" DROP CONSTRAINT "Clients_has_languages_language_id_fkey";

-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "client_language_id" INTEGER;

-- DropTable
DROP TABLE "Clients_has_languages";

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_client_language_id_fkey" FOREIGN KEY ("client_language_id") REFERENCES "Languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
