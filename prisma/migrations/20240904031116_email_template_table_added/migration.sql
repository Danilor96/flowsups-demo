-- CreateTable
CREATE TABLE "Header_email_template" (
    "id" SERIAL NOT NULL,
    "header" TEXT NOT NULL,

    CONSTRAINT "Header_email_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Footer_email_template" (
    "id" SERIAL NOT NULL,
    "footer" TEXT NOT NULL,

    CONSTRAINT "Footer_email_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Letterhead" (
    "id" SERIAL NOT NULL,
    "header_id" INTEGER,
    "footer_id" INTEGER,

    CONSTRAINT "Letterhead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email_template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL,
    "header_id" INTEGER,
    "body" TEXT NOT NULL,
    "footer_id" INTEGER,

    CONSTRAINT "Email_template_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Letterhead" ADD CONSTRAINT "Letterhead_header_id_fkey" FOREIGN KEY ("header_id") REFERENCES "Header_email_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letterhead" ADD CONSTRAINT "Letterhead_footer_id_fkey" FOREIGN KEY ("footer_id") REFERENCES "Footer_email_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email_template" ADD CONSTRAINT "Email_template_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Sms_template_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email_template" ADD CONSTRAINT "Email_template_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email_template" ADD CONSTRAINT "Email_template_header_id_fkey" FOREIGN KEY ("header_id") REFERENCES "Header_email_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email_template" ADD CONSTRAINT "Email_template_footer_id_fkey" FOREIGN KEY ("footer_id") REFERENCES "Footer_email_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
