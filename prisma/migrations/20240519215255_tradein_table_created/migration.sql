-- CreateTable
CREATE TABLE "Client_vehicle_tradein" (
    "id" SERIAL NOT NULL,
    "vin_id" INTEGER NOT NULL,
    "year_id" INTEGER NOT NULL,
    "make_id" INTEGER NOT NULL,
    "model_id" INTEGER NOT NULL,
    "trim_id" INTEGER NOT NULL,
    "mileage_id" INTEGER NOT NULL,
    "int_color_id" INTEGER NOT NULL,
    "ext_color_id" INTEGER NOT NULL,
    "book_value" TEXT NOT NULL,
    "trade_allowance" TEXT NOT NULL,
    "trade_payoff" TEXT NOT NULL,

    CONSTRAINT "Client_vehicle_tradein_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_trims" (
    "id" SERIAL NOT NULL,
    "trim" TEXT NOT NULL,

    CONSTRAINT "Vehicle_trims_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_vin_id_fkey" FOREIGN KEY ("vin_id") REFERENCES "Vehicle_identification_numbers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_year_id_fkey" FOREIGN KEY ("year_id") REFERENCES "Vehicle_manufacture_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_make_id_fkey" FOREIGN KEY ("make_id") REFERENCES "Vehicle_brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Vehicle_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_trim_id_fkey" FOREIGN KEY ("trim_id") REFERENCES "Vehicle_trims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_mileage_id_fkey" FOREIGN KEY ("mileage_id") REFERENCES "Vehicle_mileages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_int_color_id_fkey" FOREIGN KEY ("int_color_id") REFERENCES "Vehicle_colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_ext_color_id_fkey" FOREIGN KEY ("ext_color_id") REFERENCES "Vehicle_colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
