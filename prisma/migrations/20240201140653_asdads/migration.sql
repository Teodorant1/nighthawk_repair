/*
  Warnings:

  - You are about to drop the column `user_ID` on the `review` table. All the data in the column will be lost.
  - You are about to drop the `job_application` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Job_Id` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ReviewerID` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `WorkerID` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `review` DROP COLUMN `user_ID`,
    ADD COLUMN `Job_Id` VARCHAR(191) NOT NULL,
    ADD COLUMN `ReviewerID` VARCHAR(191) NOT NULL,
    ADD COLUMN `WorkerID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `TravelRange` INTEGER NULL DEFAULT 0;

-- DropTable
DROP TABLE `job_application`;
