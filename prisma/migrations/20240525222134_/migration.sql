/*
  Warnings:

  - You are about to drop the column `gender` on the `Credit_app` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Credit_app" DROP COLUMN "gender",
ADD COLUMN     "gender_id" INTEGER;

-- CreateTable
CREATE TABLE "Customer_employment" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "employment_status_id" INTEGER NOT NULL,
    "current_employer_name" TEXT,
    "previous_employer_name" TEXT,
    "current_employment_address_id" INTEGER,
    "previous_employment_address_id" INTEGER,
    "occupation_id" INTEGER NOT NULL,
    "year" TEXT NOT NULL,
    "month_id" INTEGER NOT NULL,
    "income_type_id" INTEGER NOT NULL,
    "montly_income" TEXT NOT NULL,

    CONSTRAINT "Customer_employment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer_income_type" (
    "id" SERIAL NOT NULL,
    "income" TEXT NOT NULL,

    CONSTRAINT "Customer_income_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer_occupation" (
    "id" SERIAL NOT NULL,
    "occupation" TEXT NOT NULL,

    CONSTRAINT "Customer_occupation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer_employment_address" (
    "id" SERIAL NOT NULL,
    "current_address" TEXT,
    "current_phone_number" TEXT,
    "previous_phone_number" TEXT,
    "previous_address" TEXT,

    CONSTRAINT "Customer_employment_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employment_statuses" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Employment_statuses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Credit_app" ADD CONSTRAINT "Credit_app_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app" ADD CONSTRAINT "Credit_app_id_type_id_fkey" FOREIGN KEY ("id_type_id") REFERENCES "Client_id_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app" ADD CONSTRAINT "Credit_app_id_state_id_fkey" FOREIGN KEY ("id_state_id") REFERENCES "Client_id_state"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app" ADD CONSTRAINT "Credit_app_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "Genders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_employment" ADD CONSTRAINT "Customer_employment_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_employment" ADD CONSTRAINT "Customer_employment_employment_status_id_fkey" FOREIGN KEY ("employment_status_id") REFERENCES "Employment_statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_employment" ADD CONSTRAINT "Customer_employment_current_employment_address_id_fkey" FOREIGN KEY ("current_employment_address_id") REFERENCES "Customer_employment_address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_employment" ADD CONSTRAINT "Customer_employment_previous_employment_address_id_fkey" FOREIGN KEY ("previous_employment_address_id") REFERENCES "Customer_employment_address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_employment" ADD CONSTRAINT "Customer_employment_occupation_id_fkey" FOREIGN KEY ("occupation_id") REFERENCES "Customer_occupation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_employment" ADD CONSTRAINT "Customer_employment_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "Credit_app_address_months"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_employment" ADD CONSTRAINT "Customer_employment_income_type_id_fkey" FOREIGN KEY ("income_type_id") REFERENCES "Customer_income_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
