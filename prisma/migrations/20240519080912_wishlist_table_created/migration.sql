/*
  Warnings:

  - You are about to drop the column `new` on the `Vehicle_conditions` table. All the data in the column will be lost.
  - Added the required column `condition` to the `Vehicle_conditions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle_conditions" DROP COLUMN "new",
ADD COLUMN     "condition" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Client_vehicle_wishlist" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "max_mileage_id" INTEGER NOT NULL,
    "max_price_id" INTEGER NOT NULL,
    "min_year_id" INTEGER NOT NULL,
    "exterior_color_id" INTEGER NOT NULL,
    "body_type_id" INTEGER NOT NULL,
    "client_id_id" INTEGER NOT NULL,

    CONSTRAINT "Client_vehicle_wishlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client_vehicle_wishlist" ADD CONSTRAINT "Client_vehicle_wishlist_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_wishlist" ADD CONSTRAINT "Client_vehicle_wishlist_max_mileage_id_fkey" FOREIGN KEY ("max_mileage_id") REFERENCES "Vehicle_mileages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_wishlist" ADD CONSTRAINT "Client_vehicle_wishlist_max_price_id_fkey" FOREIGN KEY ("max_price_id") REFERENCES "Vehicle_prices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_wishlist" ADD CONSTRAINT "Client_vehicle_wishlist_min_year_id_fkey" FOREIGN KEY ("min_year_id") REFERENCES "Vehicle_manufacture_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_wishlist" ADD CONSTRAINT "Client_vehicle_wishlist_exterior_color_id_fkey" FOREIGN KEY ("exterior_color_id") REFERENCES "Vehicle_colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_wishlist" ADD CONSTRAINT "Client_vehicle_wishlist_body_type_id_fkey" FOREIGN KEY ("body_type_id") REFERENCES "Vehicle_body_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_wishlist" ADD CONSTRAINT "Client_vehicle_wishlist_client_id_id_fkey" FOREIGN KEY ("client_id_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
