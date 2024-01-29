/*
  Warnings:

  - Added the required column `submitterID` to the `appliedJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `appliedjob` ADD COLUMN `submitterID` VARCHAR(191) NOT NULL;
