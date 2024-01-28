-- CreateTable
CREATE TABLE `appliedJob` (
    `id` VARCHAR(191) NOT NULL,
    `submittedJob_ID` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL,
    `userID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
