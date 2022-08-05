/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `SteamIds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[steamId]` on the table `SteamIds` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SteamIds_userId_key" ON "SteamIds"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamIds_steamId_key" ON "SteamIds"("steamId");
