/*
  Warnings:

  - Added the required column `name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNum` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNum` VARCHAR(191) NOT NULL;
