/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");
