-- DropForeignKey
ALTER TABLE `usernotificationconfig` DROP FOREIGN KEY `userNotificationConfig_userId_fkey`;

-- AddForeignKey
ALTER TABLE `userNotificationConfig` ADD CONSTRAINT `userNotificationConfig_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
