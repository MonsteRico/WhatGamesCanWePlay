/*
  Warnings:

  - The primary key for the `SteamIds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `SteamIds` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SteamIds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "steamId" TEXT NOT NULL,
    CONSTRAINT "SteamIds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SteamIds" ("steamId", "userId") SELECT "steamId", "userId" FROM "SteamIds";
DROP TABLE "SteamIds";
ALTER TABLE "new_SteamIds" RENAME TO "SteamIds";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
