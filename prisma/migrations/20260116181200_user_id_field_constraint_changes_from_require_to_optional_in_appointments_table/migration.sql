-- DropForeignKey
ALTER TABLE "Appointments" DROP CONSTRAINT "Appointments_user_id_fkey";

-- AlterTable
ALTER TABLE "Appointments" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
