-- CreateTable
CREATE TABLE "Awaiting_unknow_client" (
    "id" SERIAL NOT NULL,
    "mobile_phone_number" TEXT,
    "email" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Awaiting_unknow_client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Awaiting_unknow_client_mobile_phone_number_key" ON "Awaiting_unknow_client"("mobile_phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Awaiting_unknow_client_email_key" ON "Awaiting_unknow_client"("email");

-- AddForeignKey
ALTER TABLE "Awaiting_unknow_client" ADD CONSTRAINT "Awaiting_unknow_client_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
