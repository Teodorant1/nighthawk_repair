-- DropForeignKey
ALTER TABLE `tradesmancandidatesubcategory` DROP FOREIGN KEY `tradesmanCandidateSubCategory_tradesmanCandidateId_fkey`;

-- AddForeignKey
ALTER TABLE `tradesmanCandidateSubCategory` ADD CONSTRAINT `tradesmanCandidateSubCategory_tradesmanCandidateId_fkey` FOREIGN KEY (`tradesmanCandidateId`) REFERENCES `tradesmanCandidate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
