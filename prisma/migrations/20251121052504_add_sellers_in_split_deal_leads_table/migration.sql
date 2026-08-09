-- AlterTable
ALTER TABLE "Leads" ADD COLUMN     "isSplitSold" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "leadsId" INTEGER;

-- CreateTable
CREATE TABLE "_splitLeads" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_splitLeads_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_splitLeads_B_index" ON "_splitLeads"("B");

-- AddForeignKey
ALTER TABLE "_splitLeads" ADD CONSTRAINT "_splitLeads_A_fkey" FOREIGN KEY ("A") REFERENCES "Leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_splitLeads" ADD CONSTRAINT "_splitLeads_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
