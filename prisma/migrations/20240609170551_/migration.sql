/*
  Warnings:

  - You are about to drop the column `subject_uid` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "subject_uid",
DROP COLUMN "text",
ADD COLUMN     "memo" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "subject" TEXT NOT NULL DEFAULT '';
