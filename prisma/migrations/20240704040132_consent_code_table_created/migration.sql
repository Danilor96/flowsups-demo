-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "consent_sent" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "Consent_code" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "Consent_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Consent_code_token_key" ON "Consent_code"("token");

-- AddForeignKey
ALTER TABLE "Consent_code" ADD CONSTRAINT "Consent_code_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
