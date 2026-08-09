/*
  Warnings:

  - The `permission_id` column on the `Roles_has_permissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[role_id]` on the table `Roles_has_permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Roles_has_permissions" DROP CONSTRAINT "Roles_has_permissions_permission_id_fkey";

-- AlterTable
ALTER TABLE "Roles_has_permissions" DROP COLUMN "permission_id",
ADD COLUMN     "permission_id" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- CreateIndex
CREATE UNIQUE INDEX "Roles_has_permissions_role_id_key" ON "Roles_has_permissions"("role_id");
