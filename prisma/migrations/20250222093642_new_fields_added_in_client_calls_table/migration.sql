-- AlterTable
ALTER TABLE "Client_calls" ADD COLUMN     "answered_by_mobile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "answered_by_web" BOOLEAN NOT NULL DEFAULT false;
