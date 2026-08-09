/*
  Warnings:

  - You are about to drop the column `close` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `county_phone_code_id` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `enable` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `open` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `Business` table. All the data in the column will be lost.
  - Made the column `image` on table `Business` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "close",
DROP COLUMN "county_phone_code_id",
DROP COLUMN "enable",
DROP COLUMN "open",
DROP COLUMN "phone_number",
ALTER COLUMN "image" SET NOT NULL;
