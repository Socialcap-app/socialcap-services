/*
  Warnings:

  - You are about to drop the column `mina_txn_id` on the `transaction_queues` table. All the data in the column will be lost.
  - You are about to drop the column `mina_txn_status` on the `transaction_queues` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transaction_queues" DROP COLUMN "mina_txn_id",
DROP COLUMN "mina_txn_status",
ADD COLUMN     "txn_done" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "txn_error" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "txn_hash" TEXT NOT NULL DEFAULT '';
