/*
  Warnings:

  - Added the required column `steamId` to the `UserInstalledGames` table without a default value. This is not possible if the table is not empty.
  - Added the required column `steamId` to the `UserUninstalledGames` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userinstalledgames` ADD COLUMN `steamId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `useruninstalledgames` ADD COLUMN `steamId` VARCHAR(191) NOT NULL;
