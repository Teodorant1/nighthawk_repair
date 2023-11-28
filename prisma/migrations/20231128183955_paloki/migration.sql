/*
  Warnings:

  - Added the required column `moneycost` to the `submitted_job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timecost` to the `submitted_job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `submitted_job` ADD COLUMN `moneycost` INTEGER NOT NULL,
    ADD COLUMN `timecost` INTEGER NOT NULL;
