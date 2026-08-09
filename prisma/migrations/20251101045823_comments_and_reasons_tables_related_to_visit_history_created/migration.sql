-- CreateTable
CREATE TABLE "Daily_visit_history_comments" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "visitHistoryId" INTEGER NOT NULL,

    CONSTRAINT "Daily_visit_history_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Daily_visit_history_reasons" (
    "id" SERIAL NOT NULL,
    "reasons" TEXT NOT NULL,
    "visitHistoryId" INTEGER NOT NULL,

    CONSTRAINT "Daily_visit_history_reasons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Daily_visit_history_comments" ADD CONSTRAINT "Daily_visit_history_comments_visitHistoryId_fkey" FOREIGN KEY ("visitHistoryId") REFERENCES "Daily_visit_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daily_visit_history_reasons" ADD CONSTRAINT "Daily_visit_history_reasons_visitHistoryId_fkey" FOREIGN KEY ("visitHistoryId") REFERENCES "Daily_visit_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;
