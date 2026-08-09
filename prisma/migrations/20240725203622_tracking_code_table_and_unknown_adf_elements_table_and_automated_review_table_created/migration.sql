-- CreateTable
CREATE TABLE "Tracking_code" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Tracking_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unknow_adf_elements" (
    "id" SERIAL NOT NULL,
    "element" TEXT NOT NULL,

    CONSTRAINT "Unknow_adf_elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Automated_review" (
    "id" SERIAL NOT NULL,
    "invitation" TEXT NOT NULL,

    CONSTRAINT "Automated_review_pkey" PRIMARY KEY ("id")
);
