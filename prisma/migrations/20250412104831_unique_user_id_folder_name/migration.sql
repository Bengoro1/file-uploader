/*
  Warnings:

  - A unique constraint covering the columns `[userId,folder_name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Folder_userId_folder_name_key" ON "Folder"("userId", "folder_name");
