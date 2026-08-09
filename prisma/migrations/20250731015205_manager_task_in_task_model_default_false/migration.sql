/*
  Warnings:

  - Made the column `manager_task` on table `Tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- Paso previo: limpiar valores nulos
UPDATE "Tasks" SET "manager_task" = false WHERE "manager_task" IS NULL;
-- AlterTable
ALTER TABLE "Tasks" ALTER COLUMN "manager_task" SET NOT NULL,
ALTER COLUMN "manager_task" SET DEFAULT false;
