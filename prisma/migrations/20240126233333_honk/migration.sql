/*
  Warnings:

  - You are about to drop the column `name` on the `usernotificationconfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `TravelRange` INTEGER NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL DEFAULT 'UK',
    ADD COLUMN `distance` INTEGER NULL,
    ADD COLUMN `latitude` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    ADD COLUMN `longitude` DECIMAL(65, 30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `usernotificationconfig` DROP COLUMN `name`,
    ADD COLUMN `emailEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pushEnabled` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `profileSubCategory` (
    `id` VARCHAR(191) NOT NULL,
    `user_ID` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `subcategory` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` VARCHAR(191) NOT NULL,
    `user_ID` VARCHAR(191) NOT NULL,
    `reviewText` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificate` (
    `id` VARCHAR(191) NOT NULL,
    `user_ID` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `Link` VARCHAR(191) NOT NULL,
    `date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workGalleryPicture` (
    `id` VARCHAR(191) NOT NULL,
    `user_ID` VARCHAR(191) NOT NULL,
    `cloudinaryID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
