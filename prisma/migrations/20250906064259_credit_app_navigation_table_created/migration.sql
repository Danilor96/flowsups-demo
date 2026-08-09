-- CreateTable
CREATE TABLE "Credit_app_navigation" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "nextToAddress" BOOLEAN NOT NULL DEFAULT false,
    "nextToEmploymentStatus" BOOLEAN NOT NULL DEFAULT false,
    "nextToReferences" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Credit_app_navigation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credit_app_navigation_customer_id_key" ON "Credit_app_navigation"("customer_id");

-- AddForeignKey
ALTER TABLE "Credit_app_navigation" ADD CONSTRAINT "Credit_app_navigation_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
