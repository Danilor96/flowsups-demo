-- DropForeignKey
ALTER TABLE "Roles_has_permissions" DROP CONSTRAINT "Roles_has_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "Roles_has_permissions" DROP CONSTRAINT "Roles_has_permissions_role_id_fkey";

-- AddForeignKey
ALTER TABLE "Roles_has_permissions" ADD CONSTRAINT "Roles_has_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roles_has_permissions" ADD CONSTRAINT "Roles_has_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
