-- CreateTable
CREATE TABLE "Credit_app" (
    "id" SERIAL NOT NULL,
    "ssn" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "id_type_id" INTEGER,
    "id_state_id" INTEGER,
    "id_number" TEXT,
    "id_issue_date" TIMESTAMP(3),
    "id_expiration_date" TIMESTAMP(3),
    "cash_down" TEXT,
    "gender" INTEGER,
    "send_automated_sms" BOOLEAN,

    CONSTRAINT "Credit_app_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client_id_type" (
    "id" SERIAL NOT NULL,
    "id_type" TEXT NOT NULL,

    CONSTRAINT "Client_id_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client_id_state" (
    "id" SERIAL NOT NULL,
    "id_state" TEXT NOT NULL,

    CONSTRAINT "Client_id_state_pkey" PRIMARY KEY ("id")
);
