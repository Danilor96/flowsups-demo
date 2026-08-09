-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
