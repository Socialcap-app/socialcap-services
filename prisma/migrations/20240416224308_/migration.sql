/*
  Warnings:

  - You are about to drop the column `approvedUTC` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "approvedUTC",
ADD COLUMN     "approved_utc" TIMESTAMP(3);
