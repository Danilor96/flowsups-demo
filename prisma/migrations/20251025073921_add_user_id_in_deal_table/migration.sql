-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "seller_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
