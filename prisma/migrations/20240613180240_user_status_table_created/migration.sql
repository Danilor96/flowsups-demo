-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "status_id" INTEGER;

-- CreateTable
CREATE TABLE "User_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "User_status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "User_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
