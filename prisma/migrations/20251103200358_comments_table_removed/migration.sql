/*
  Warnings:

  - You are about to drop the `Daily_visit_history_comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Daily_visit_history_comments" DROP CONSTRAINT "Daily_visit_history_comments_visitHistoryId_fkey";

-- DropTable
DROP TABLE "Daily_visit_history_comments";
