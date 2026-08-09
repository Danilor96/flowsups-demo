-- CreateTable
CREATE TABLE "Title_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Title_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Title_brand" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,

    CONSTRAINT "Title_brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_details_title_license" (
    "id" SERIAL NOT NULL,
    "title_owner" TEXT NOT NULL,
    "ros_title" TEXT NOT NULL,
    "title_state_id" INTEGER NOT NULL,
    "title_status_id" INTEGER NOT NULL,
    "title_brand_id" INTEGER NOT NULL,
    "license_no" TEXT NOT NULL,
    "license_state_id" INTEGER NOT NULL,
    "license_expiration" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_details_title_license_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle_details_title_license" ADD CONSTRAINT "Vehicle_details_title_license_title_state_id_fkey" FOREIGN KEY ("title_state_id") REFERENCES "Client_id_state"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_title_license" ADD CONSTRAINT "Vehicle_details_title_license_title_status_id_fkey" FOREIGN KEY ("title_status_id") REFERENCES "Title_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_title_license" ADD CONSTRAINT "Vehicle_details_title_license_title_brand_id_fkey" FOREIGN KEY ("title_brand_id") REFERENCES "Title_brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_title_license" ADD CONSTRAINT "Vehicle_details_title_license_license_state_id_fkey" FOREIGN KEY ("license_state_id") REFERENCES "Client_id_state"("id") ON DELETE CASCADE ON UPDATE CASCADE;
