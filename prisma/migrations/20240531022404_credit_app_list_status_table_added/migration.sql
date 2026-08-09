-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "credit_app_list_status_id" INTEGER;

-- CreateTable
CREATE TABLE "Credit_app_list_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Credit_app_list_status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_credit_app_list_status_id_fkey" FOREIGN KEY ("credit_app_list_status_id") REFERENCES "Credit_app_list_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
