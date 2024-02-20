-- CreateTable
CREATE TABLE `tradesmanCandidate` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `BusinessName` VARCHAR(191) NOT NULL,
    `BusinessAddress` VARCHAR(191) NOT NULL,
    `CompanyNumber` VARCHAR(191) NOT NULL,
    `Approved` BOOLEAN NOT NULL,
    `LiabilityLicenseLink` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tradesmanCandidateSubCategory` (
    `id` VARCHAR(191) NOT NULL,
    `SubCategory` VARCHAR(191) NOT NULL,
    `categoryID` TEXT NOT NULL,
    `tradesmanCandidateId` VARCHAR(191) NULL,

    UNIQUE INDEX `tradesmanCandidateSubCategory_SubCategory_key`(`SubCategory`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tradesmanCandidateSubCategory` ADD CONSTRAINT `tradesmanCandidateSubCategory_tradesmanCandidateId_fkey` FOREIGN KEY (`tradesmanCandidateId`) REFERENCES `tradesmanCandidate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
