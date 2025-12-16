/*
  Warnings:

  - Added the required column `title` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `access_token` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `access_token_expires_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "is_all_day" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "access_token_expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "calendar_synced_until" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "display_name" TEXT,
ADD COLUMN     "profile_picture" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
