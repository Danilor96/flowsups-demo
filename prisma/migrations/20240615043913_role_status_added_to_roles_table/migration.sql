/*
  Warnings:

  - Added the required column `status_id` to the `Roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Roles" ADD COLUMN     "status_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Role_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Role_status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Roles" ADD CONSTRAINT "Roles_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Role_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
