-- AlterTable
ALTER TABLE "Activation_codes" ALTER COLUMN "code" DROP NOT NULL,
ALTER COLUMN "activation_code_expired" DROP NOT NULL;
