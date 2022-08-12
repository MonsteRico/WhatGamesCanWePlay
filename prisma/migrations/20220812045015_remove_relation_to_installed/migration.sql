/*
  Warnings:

  - You are about to drop the column `userId` on the `userinstalledgames` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `useruninstalledgames` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `userinstalledgames` DROP FOREIGN KEY `UserInstalledGames_userId_fkey`;

-- DropForeignKey
ALTER TABLE `useruninstalledgames` DROP FOREIGN KEY `UserUninstalledGames_userId_fkey`;

-- AlterTable
ALTER TABLE `userinstalledgames` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `useruninstalledgames` DROP COLUMN `userId`;
