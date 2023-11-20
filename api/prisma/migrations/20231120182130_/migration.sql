/*
  Warnings:

  - You are about to drop the column `to` on the `transaction_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transaction_events" DROP COLUMN "to",
ADD COLUMN     "subject" TEXT NOT NULL DEFAULT '';
