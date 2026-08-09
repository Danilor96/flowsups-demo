/*
  Warnings:

  - You are about to drop the column `forgot_password_code` on the `Activation_codes` table. All the data in the column will be lost.
  - You are about to drop the column `forgot_password_code_expired` on the `Activation_codes` table. All the data in the column will be lost.
  - You are about to drop the column `forgot_password_code_id` on the `Users_has_codes` table. All the data in the column will be lost.
  - Made the column `code` on table `Activation_codes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `activation_code_expired` on table `Activation_codes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code_id` on table `Users_has_codes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Users_has_codes" DROP CONSTRAINT "Users_has_codes_code_id_fkey";

-- DropForeignKey
ALTER TABLE "Users_has_codes" DROP CONSTRAINT "Users_has_codes_forgot_password_code_id_fkey";

-- DropIndex
DROP INDEX "Activation_codes_forgot_password_code_key";

-- AlterTable
ALTER TABLE "Activation_codes" DROP COLUMN "forgot_password_code",
DROP COLUMN "forgot_password_code_expired",
ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "activation_code_expired" SET NOT NULL;

-- AlterTable
ALTER TABLE "Users_has_codes" DROP COLUMN "forgot_password_code_id",
ALTER COLUMN "code_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Users_has_codes" ADD CONSTRAINT "Users_has_codes_code_id_fkey" FOREIGN KEY ("code_id") REFERENCES "Activation_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
