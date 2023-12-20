/*
  Warnings:

  - You are about to drop the `final_quote` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `coins` INTEGER NULL;

-- DropTable
DROP TABLE `final_quote`;
