/*
  Warnings:

  - You are about to drop the column `cloudinaryID` on the `JobPicture` table. All the data in the column will be lost.
  - You are about to drop the column `cloudinaryID` on the `workGalleryPicture` table. All the data in the column will be lost.
  - Added the required column `pictureID` to the `JobPicture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pictureID` to the `workGalleryPicture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobPicture" DROP COLUMN "cloudinaryID",
ADD COLUMN     "pictureID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "workGalleryPicture" DROP COLUMN "cloudinaryID",
ADD COLUMN     "pictureID" TEXT NOT NULL;
