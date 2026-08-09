-- DropForeignKey
ALTER TABLE "Users_has_roles" DROP CONSTRAINT "Users_has_roles_role_id_fkey";

-- DropForeignKey
ALTER TABLE "Users_has_roles" DROP CONSTRAINT "Users_has_roles_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Users_has_roles" ADD CONSTRAINT "Users_has_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users_has_roles" ADD CONSTRAINT "Users_has_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
