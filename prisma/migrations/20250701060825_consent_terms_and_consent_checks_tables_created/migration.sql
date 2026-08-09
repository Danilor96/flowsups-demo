-- CreateTable
CREATE TABLE "Consent_terms" (
    "id" SERIAL NOT NULL,
    "consent_statement" TEXT NOT NULL,
    "checks" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "Consent_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent_checks" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL,

    CONSTRAINT "Consent_checks_pkey" PRIMARY KEY ("id")
);
