-- CreateTable
CREATE TABLE "Sms_template_variables_category" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Sms_template_variables_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sms_template_variables" (
    "id" SERIAL NOT NULL,
    "variable" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "Sms_template_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sms_template_variables_tagged" (
    "id" SERIAL NOT NULL,
    "sms_template_variable_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Sms_template_variables_tagged_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sms_template_variables" ADD CONSTRAINT "Sms_template_variables_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Sms_template_variables_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sms_template_variables_tagged" ADD CONSTRAINT "Sms_template_variables_tagged_sms_template_variable_id_fkey" FOREIGN KEY ("sms_template_variable_id") REFERENCES "Sms_template_variables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sms_template_variables_tagged" ADD CONSTRAINT "Sms_template_variables_tagged_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
