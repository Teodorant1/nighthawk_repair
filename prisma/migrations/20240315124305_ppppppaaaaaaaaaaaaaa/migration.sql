-- DropForeignKey
ALTER TABLE `jobpicture` DROP FOREIGN KEY `JobPicture_submitted_jobId_fkey`;

-- DropForeignKey
ALTER TABLE `tradesmancandidatesubcategory` DROP FOREIGN KEY `tradesmanCandidateSubCategory_tradesmanCandidateId_fkey`;

-- DropForeignKey
ALTER TABLE `usernotificationconfig` DROP FOREIGN KEY `userNotificationConfig_userId_fkey`;

-- AlterTable
ALTER TABLE `submitted_job` ADD COLUMN `postalCode` VARCHAR(191) NOT NULL DEFAULT 'defaultAddress';
