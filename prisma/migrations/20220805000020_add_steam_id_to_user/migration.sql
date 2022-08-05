/*
  Warnings:

  - You are about to drop the `SteamIds` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[steamId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "steamId" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SteamIds";
PRAGMA foreign_keys=on;

-- CreateIndex
CREATE UNIQUE INDEX "User_steamId_key" ON "User"("steamId");
