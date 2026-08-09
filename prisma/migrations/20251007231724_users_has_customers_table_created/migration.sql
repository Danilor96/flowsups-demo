-- CreateTable
CREATE TABLE "Users_has_customers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_has_customers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Users_has_customers" ADD CONSTRAINT "Users_has_customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users_has_customers" ADD CONSTRAINT "Users_has_customers_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
