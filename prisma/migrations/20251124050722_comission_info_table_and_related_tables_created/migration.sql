-- CreateTable
CREATE TABLE "Comission_info" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Comission_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comission_spiff" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT NOT NULL,
    "comission_info_id" INTEGER NOT NULL,

    CONSTRAINT "Comission_spiff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comission_bonus" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT NOT NULL,
    "comission_info_id" INTEGER NOT NULL,

    CONSTRAINT "Comission_bonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comission_salary" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT NOT NULL,
    "comission_info_id" INTEGER NOT NULL,

    CONSTRAINT "Comission_salary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comission_info_user_id_key" ON "Comission_info"("user_id");

-- AddForeignKey
ALTER TABLE "Comission_info" ADD CONSTRAINT "Comission_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comission_spiff" ADD CONSTRAINT "Comission_spiff_comission_info_id_fkey" FOREIGN KEY ("comission_info_id") REFERENCES "Comission_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comission_bonus" ADD CONSTRAINT "Comission_bonus_comission_info_id_fkey" FOREIGN KEY ("comission_info_id") REFERENCES "Comission_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comission_salary" ADD CONSTRAINT "Comission_salary_comission_info_id_fkey" FOREIGN KEY ("comission_info_id") REFERENCES "Comission_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
