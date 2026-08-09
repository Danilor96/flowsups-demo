-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "deleted" SET DEFAULT false;

-- CreateTable
CREATE TABLE "Incidents" (
    "id" SERIAL NOT NULL,
    "incident" TEXT NOT NULL,
    "section" TEXT,

    CONSTRAINT "Incidents_pkey" PRIMARY KEY ("id")
);
