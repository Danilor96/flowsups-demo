-- CreateTable
CREATE TABLE "Automatic_sms" (
    "id" SERIAL NOT NULL,
    "appointment_reminder" BOOLEAN NOT NULL DEFAULT false,
    "appointment_reminder_timing" BOOLEAN NOT NULL DEFAULT false,
    "appointment_schedule_on_site" BOOLEAN NOT NULL DEFAULT false,
    "appointment_schedule_online" BOOLEAN NOT NULL DEFAULT false,
    "appointment_reschedule_onSite" BOOLEAN NOT NULL DEFAULT false,
    "appointment_reschedule_online" BOOLEAN NOT NULL DEFAULT false,
    "stipulation_request" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Automatic_sms_pkey" PRIMARY KEY ("id")
);
