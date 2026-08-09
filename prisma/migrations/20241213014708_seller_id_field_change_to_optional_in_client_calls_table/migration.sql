-- DropForeignKey
ALTER TABLE "Client_calls" DROP CONSTRAINT "Client_calls_seller_id_fkey";

-- AlterTable
ALTER TABLE "Client_calls" ALTER COLUMN "seller_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Client_calls" ADD CONSTRAINT "Client_calls_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
