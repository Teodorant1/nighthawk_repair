/*
  Warnings:

  - You are about to drop the column `timecost_` on the `answer` table. All the data in the column will be lost.
  - Added the required column `timecost` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `answer` DROP COLUMN `timecost_`,
    ADD COLUMN `timecost` INTEGER NOT NULL;
