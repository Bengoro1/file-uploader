-- DropIndex
DROP INDEX "User_first_name_last_name_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
