-- AlterTable
ALTER TABLE `answer` MODIFY `text_answer` TEXT NOT NULL,
    MODIFY `categoryID` TEXT NOT NULL,
    MODIFY `questionID` TEXT NOT NULL,
    MODIFY `sub_categoryID` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `final_quote` MODIFY `text_answer` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `question` MODIFY `categoryID` TEXT NOT NULL,
    MODIFY `sub_categoryID` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `sub_category` MODIFY `categoryID` TEXT NOT NULL;
