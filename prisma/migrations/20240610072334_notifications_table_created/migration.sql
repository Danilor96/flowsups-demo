-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "customer_id" INTEGER,
    "message" TEXT NOT NULL,
    "type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type_notification" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Type_notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Type_notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
