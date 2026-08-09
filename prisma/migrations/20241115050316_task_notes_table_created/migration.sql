-- CreateTable
CREATE TABLE "Task_Notes" (
    "id" SERIAL NOT NULL,
    "note" TEXT NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_Notes_pkey" PRIMARY KEY ("id")
);
