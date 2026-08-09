-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "lost_reason_id" INTEGER;

-- CreateTable
CREATE TABLE "Lost_reasons" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "Lost_reasons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_lost_reason_id_fkey" FOREIGN KEY ("lost_reason_id") REFERENCES "Lost_reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
