-- DropForeignKey
ALTER TABLE "Marketing_cost" DROP CONSTRAINT "Marketing_cost_source_id_fkey";

-- AddForeignKey
ALTER TABLE "Marketing_cost" ADD CONSTRAINT "Marketing_cost_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Lead_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
