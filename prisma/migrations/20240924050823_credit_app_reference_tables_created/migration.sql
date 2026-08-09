-- CreateTable
CREATE TABLE "Credit_app_reference_relationship" (
    "id" SERIAL NOT NULL,
    "relationship" TEXT NOT NULL,

    CONSTRAINT "Credit_app_reference_relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit_app_other_income" (
    "id" SERIAL NOT NULL,
    "income_amount" TEXT NOT NULL,
    "income_source" TEXT NOT NULL,
    "credit_app_reference_id" INTEGER NOT NULL,

    CONSTRAINT "Credit_app_other_income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit_app_reference" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "relationship_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Credit_app_reference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Credit_app_other_income" ADD CONSTRAINT "Credit_app_other_income_credit_app_reference_id_fkey" FOREIGN KEY ("credit_app_reference_id") REFERENCES "Credit_app_reference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_reference" ADD CONSTRAINT "Credit_app_reference_relationship_id_fkey" FOREIGN KEY ("relationship_id") REFERENCES "Credit_app_reference_relationship"("id") ON DELETE CASCADE ON UPDATE CASCADE;
