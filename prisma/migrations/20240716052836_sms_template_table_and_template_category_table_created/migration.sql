-- CreateTable
CREATE TABLE "Sms_template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "creted_date" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Sms_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template_category" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Template_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sms_template" ADD CONSTRAINT "Sms_template_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Template_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
