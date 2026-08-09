-- CreateTable
CREATE TABLE "Notifications_preferences" (
    "id" SERIAL NOT NULL,
    "notification" TEXT NOT NULL,
    "type_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Notifications_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications_types" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Notifications_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notifications_preferences" ADD CONSTRAINT "Notifications_preferences_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Notifications_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
