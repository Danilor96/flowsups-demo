-- CreateTable
CREATE TABLE "Suspension" (
    "id" SERIAL NOT NULL,
    "mobile_phone" TEXT NOT NULL,
    "start_suspension_date" TIMESTAMP(3) NOT NULL,
    "end_suspension_dat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suspension_pkey" PRIMARY KEY ("id")
);
