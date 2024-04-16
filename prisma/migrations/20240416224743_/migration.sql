/*
  Warnings:

  - You are about to drop the column `communityUid` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `personUid` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "communityUid",
DROP COLUMN "personUid",
ADD COLUMN     "community_uid" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "person_uid" TEXT NOT NULL DEFAULT '';
