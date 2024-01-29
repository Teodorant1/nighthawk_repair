/*
  Warnings:

  - You are about to drop the column `submitterID` on the `appliedjob` table. All the data in the column will be lost.
  - Added the required column `submitterEmail` to the `appliedJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `appliedjob` DROP COLUMN `submitterID`,
    ADD COLUMN `submitterEmail` VARCHAR(191) NOT NULL;
