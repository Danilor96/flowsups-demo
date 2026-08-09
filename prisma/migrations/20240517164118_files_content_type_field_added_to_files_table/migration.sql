/*
  Warnings:

  - Added the required column `content_type` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Clients_has_files" DROP CONSTRAINT "Clients_has_files_file_id_fkey";

-- DropForeignKey
ALTER TABLE "Clients_has_files" DROP CONSTRAINT "Clients_has_files_uploader_user_id_fkey";

-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "content_type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Clients_has_files" ADD CONSTRAINT "Clients_has_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients_has_files" ADD CONSTRAINT "Clients_has_files_uploader_user_id_fkey" FOREIGN KEY ("uploader_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
