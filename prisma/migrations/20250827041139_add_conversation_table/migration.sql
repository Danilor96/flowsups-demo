-- CreateTable
CREATE TABLE "conversations" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "pending_reply_count" INTEGER NOT NULL DEFAULT 0,
    "last_message_from_client" BOOLEAN NOT NULL DEFAULT false,
    "last_message_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conversations_client_id_key" ON "conversations"("client_id");

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
