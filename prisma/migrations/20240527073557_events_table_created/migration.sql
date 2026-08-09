-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
