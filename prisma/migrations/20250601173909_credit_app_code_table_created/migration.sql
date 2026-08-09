-- CreateTable
CREATE TABLE "Credit_app_code" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "code_expired" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credit_app_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credit_app_code_customer_id_key" ON "Credit_app_code"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Credit_app_code_token_key" ON "Credit_app_code"("token");

-- AddForeignKey
ALTER TABLE "Credit_app_code" ADD CONSTRAINT "Credit_app_code_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
