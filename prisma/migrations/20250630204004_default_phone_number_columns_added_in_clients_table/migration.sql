-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "home_default" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mobile_default" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "work_default" BOOLEAN NOT NULL DEFAULT false;
