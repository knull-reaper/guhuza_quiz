-- CreateTable
CREATE TABLE `level` (
    `Level_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Level_Title` VARCHAR(191) NOT NULL,
    `Level_number` INTEGER NOT NULL,

    PRIMARY KEY (`Level_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `milestone` (
    `Milestone_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Milestone_Title` VARCHAR(191) NOT NULL,
    `Milestone_description` VARCHAR(191) NOT NULL,
    `UnlockingLevel` INTEGER NOT NULL,
    `Milestone_reward_message` VARCHAR(191) NOT NULL,
    `Milestone_Link` VARCHAR(191) NOT NULL,
    `Milestone_Button_CTA` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Milestone_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player` (
    `Player_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Player_name` VARCHAR(191) NOT NULL,
    `Playerpoint` INTEGER NOT NULL,
    `streak` INTEGER NOT NULL,
    `lastLogin` DATETIME(3) NOT NULL,
    `Level_Id` INTEGER NULL,
    `Milestone_Id` INTEGER NULL,

    INDEX `Player_Level_Id_fkey`(`Level_Id`),
    INDEX `Player_Milestone_Id_fkey`(`Milestone_Id`),
    PRIMARY KEY (`Player_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Progress` (
    `id` VARCHAR(191) NOT NULL,
    `levelReached` INTEGER NOT NULL,
    `percentComplete` DOUBLE NOT NULL,
    `lastPlayedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `playerId` INTEGER NOT NULL,

    UNIQUE INDEX `Progress_playerId_key`(`playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `player` ADD CONSTRAINT `Player_Level_Id_fkey` FOREIGN KEY (`Level_Id`) REFERENCES `level`(`Level_Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player` ADD CONSTRAINT `Player_Milestone_Id_fkey` FOREIGN KEY (`Milestone_Id`) REFERENCES `milestone`(`Milestone_Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Progress` ADD CONSTRAINT `Progress_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `player`(`Player_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
