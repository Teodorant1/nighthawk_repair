/*
  Warnings:

  - Made the column `coins` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `coins` INTEGER NOT NULL DEFAULT 0;
