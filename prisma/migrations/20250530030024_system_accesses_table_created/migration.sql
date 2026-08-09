-- CreateTable
CREATE TABLE "System_accesses" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "entry_date" TIMESTAMP(3) NOT NULL,
    "exit_date" TIMESTAMP(3),

    CONSTRAINT "System_accesses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "System_accesses" ADD CONSTRAINT "System_accesses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
