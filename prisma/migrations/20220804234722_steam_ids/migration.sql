-- CreateTable
CREATE TABLE "SteamIds" (
    "userId" TEXT NOT NULL,
    "steamId" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "SteamIds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
