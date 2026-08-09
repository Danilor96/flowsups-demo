-- CreateTable
CREATE TABLE "User_schedule" (
    "id" SERIAL NOT NULL,
    "dayweek_id" INTEGER NOT NULL,
    "from_day_times_id" INTEGER NOT NULL,
    "to_day_times_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "User_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_schedule_dayweek" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,

    CONSTRAINT "User_schedule_dayweek_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User_schedule" ADD CONSTRAINT "User_schedule_dayweek_id_fkey" FOREIGN KEY ("dayweek_id") REFERENCES "User_schedule_dayweek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_schedule" ADD CONSTRAINT "User_schedule_from_day_times_id_fkey" FOREIGN KEY ("from_day_times_id") REFERENCES "Day_times"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_schedule" ADD CONSTRAINT "User_schedule_to_day_times_id_fkey" FOREIGN KEY ("to_day_times_id") REFERENCES "Day_times"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_schedule" ADD CONSTRAINT "User_schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
