/*
  Warnings:

  - A unique constraint covering the columns `[Job_Id]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Review_Job_Id_key` ON `Review`(`Job_Id`);
