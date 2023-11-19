/*
  Warnings:

  - You are about to drop the column `category_CUID` on the `sub_category` table. All the data in the column will be lost.
  - Added the required column `categoryID` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionID` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_categoryID` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryID` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_categoryID` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryID` to the `Sub_Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `answer` ADD COLUMN `categoryID` VARCHAR(191) NOT NULL,
    ADD COLUMN `questionID` VARCHAR(191) NOT NULL,
    ADD COLUMN `sub_categoryID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `question` ADD COLUMN `categoryID` VARCHAR(191) NOT NULL,
    ADD COLUMN `sub_categoryID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `sub_category` DROP COLUMN `category_CUID`,
    ADD COLUMN `categoryID` VARCHAR(191) NOT NULL;
