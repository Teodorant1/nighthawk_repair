/*
  Warnings:

  - Added the required column `optional_answeredQuestions` to the `submitted_job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `submitted_job` ADD COLUMN `optional_answeredQuestions` TEXT NOT NULL;
