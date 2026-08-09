-- DropForeignKey
ALTER TABLE "Users_has_codes" DROP CONSTRAINT "Users_has_codes_code_id_fkey";

-- AlterTable
ALTER TABLE "Users_has_codes" ALTER COLUMN "code_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Users_has_codes" ADD CONSTRAINT "Users_has_codes_code_id_fkey" FOREIGN KEY ("code_id") REFERENCES "Activation_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users_has_codes" ADD CONSTRAINT "Users_has_codes_forgot_password_code_id_fkey" FOREIGN KEY ("forgot_password_code_id") REFERENCES "Activation_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
