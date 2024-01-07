/*
  Warnings:

  - You are about to drop the column `imagesArray` on the `submitted_job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `submitted_job` DROP COLUMN `imagesArray`,
    ADD COLUMN `title` VARCHAR(191) NULL;
