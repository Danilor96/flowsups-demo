-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "home_phone" DROP NOT NULL,
ALTER COLUMN "mobile_phone" DROP NOT NULL,
ALTER COLUMN "work_phone" DROP NOT NULL;
