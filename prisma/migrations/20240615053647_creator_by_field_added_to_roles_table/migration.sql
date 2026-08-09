-- AlterTable
ALTER TABLE "Roles" ADD COLUMN     "created_by" INTEGER;

-- AddForeignKey
ALTER TABLE "Roles" ADD CONSTRAINT "Roles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
