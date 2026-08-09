/*
  Warnings:

  - Added the required column `uploader_user_id` to the `Clients_has_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Clients_has_files" ADD COLUMN     "uploader_user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Clients_has_files" ADD CONSTRAINT "Clients_has_files_uploader_user_id_fkey" FOREIGN KEY ("uploader_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
