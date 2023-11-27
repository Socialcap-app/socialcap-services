/*
  Warnings:

  - You are about to drop the column `assignee_uid` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `community_uid` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `elector_account_id` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `plan_uid` on the `batches` table. All the data in the column will be lost.
  - Added the required column `signer_account_id` to the `batches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "batches" DROP COLUMN "assignee_uid",
DROP COLUMN "community_uid",
DROP COLUMN "elector_account_id",
DROP COLUMN "plan_uid",
ADD COLUMN     "done_utc" TIMESTAMP(3),
ADD COLUMN     "metadata" TEXT NOT NULL DEFAULT '{}',
ADD COLUMN     "signer_account_id" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'NONE';
