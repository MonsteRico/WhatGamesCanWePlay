/*
  Warnings:

  - A unique constraint covering the columns `[groupId]` on the table `GroupOwner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `GroupOwner_groupId_key` ON `GroupOwner`(`groupId`);
