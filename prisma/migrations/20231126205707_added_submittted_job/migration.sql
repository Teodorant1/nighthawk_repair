-- CreateTable
CREATE TABLE `submitted_job` (
    `id` VARCHAR(191) NOT NULL,
    `sub_categoryID` TEXT NOT NULL,
    `categoryID` TEXT NOT NULL,
    `answeredQuestions` TEXT NOT NULL,
    `isVisible` BOOLEAN NOT NULL DEFAULT false,
    `submittterEmail` VARCHAR(191) NOT NULL,
    `date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
