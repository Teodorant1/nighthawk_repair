-- AlterTable
ALTER TABLE `submitted_job` ADD COLUMN `finalWorkerID` VARCHAR(191) NULL,
    ADD COLUMN `hiringstage` VARCHAR(191) NULL,
    ADD COLUMN `imagesArray` JSON NULL,
    ADD COLUMN `maxBudget` INTEGER NULL DEFAULT 10000,
    ADD COLUMN `minBudget` INTEGER NULL DEFAULT 0,
    ADD COLUMN `status` VARCHAR(191) NULL,
    ADD COLUMN `timing` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `notificationsEnabled` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `userNotificationConfig` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `userNotificationConfig_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_application` (
    `id` VARCHAR(191) NOT NULL,
    `submittedJob_ID` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userNotificationConfig` ADD CONSTRAINT `userNotificationConfig_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
