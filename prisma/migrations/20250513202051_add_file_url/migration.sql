/*
  Warnings:

  - A unique constraint covering the columns `[userId,file_name]` on the table `UploadedFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_url` to the `UploadedFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UploadedFile" ADD COLUMN     "file_url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UploadedFile_userId_file_name_key" ON "UploadedFile"("userId", "file_name");
