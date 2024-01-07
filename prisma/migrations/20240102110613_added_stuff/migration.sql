-- CreateTable
CREATE TABLE `JobPicture` (
    `id` VARCHAR(191) NOT NULL,
    `cloudinaryID` VARCHAR(191) NOT NULL,
    `submitted_jobId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JobPicture` ADD CONSTRAINT `JobPicture_submitted_jobId_fkey` FOREIGN KEY (`submitted_jobId`) REFERENCES `submitted_job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
