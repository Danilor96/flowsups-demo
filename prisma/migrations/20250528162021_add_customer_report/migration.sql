-- CreateEnum
CREATE TYPE "ListViewTypes" AS ENUM ('ListView', 'DetailView');

-- CreateTable
CREATE TABLE "Customer_Report" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner_user_id" INTEGER NOT NULL,
    "filters" JSONB NOT NULL,
    "sort_config" JSONB NOT NULL,
    "advanced_filters" JSONB NOT NULL,
    "view_type" "ListViewTypes" NOT NULL,

    CONSTRAINT "Customer_Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Customer_Report" ADD CONSTRAINT "Customer_Report_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
