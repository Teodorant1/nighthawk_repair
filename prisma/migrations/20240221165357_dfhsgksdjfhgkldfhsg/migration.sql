-- CreateIndex
CREATE INDEX `userNotificationConfig_userId_idx` ON `userNotificationConfig`(`userId`);

-- RenameIndex
ALTER TABLE `jobpicture` RENAME INDEX `JobPicture_submitted_jobId_fkey` TO `JobPicture_submitted_jobId_idx`;

-- RenameIndex
ALTER TABLE `tradesmancandidatesubcategory` RENAME INDEX `tradesmanCandidateSubCategory_tradesmanCandidateId_fkey` TO `tradesmanCandidateSubCategory_tradesmanCandidateId_idx`;
