-- CreateTable
CREATE TABLE "Terms_and_conditions_processed" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "term_or_condition_id" INTEGER,

    CONSTRAINT "Terms_and_conditions_processed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Terms_and_conditions_processed" ADD CONSTRAINT "Terms_and_conditions_processed_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Terms_and_conditions_processed" ADD CONSTRAINT "Terms_and_conditions_processed_term_or_condition_id_fkey" FOREIGN KEY ("term_or_condition_id") REFERENCES "Consent_checks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
