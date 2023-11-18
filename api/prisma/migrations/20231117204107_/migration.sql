-- AlterTable
ALTER TABLE "batches" ADD COLUMN     "batch_received_txn_uid" TEXT DEFAULT '',
ADD COLUMN     "batches_account_id" TEXT DEFAULT '',
ADD COLUMN     "batches_commited_txn_uid" TEXT DEFAULT '';

-- CreateTable
CREATE TABLE "trx_queues" (
    "uid" TEXT NOT NULL,
    "sequence" SERIAL NOT NULL,
    "queue" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "data" TEXT NOT NULL DEFAULT '{}',
    "state" INTEGER NOT NULL DEFAULT 9,
    "received_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submited_utc" TIMESTAMP(3) NOT NULL,
    "done_utc" TIMESTAMP(3),
    "retries" INTEGER NOT NULL DEFAULT 0,
    "mina_txn_id" TEXT NOT NULL DEFAULT '',
    "mina_txn_status" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "trx_queues_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "trx_queues_uid_key" ON "trx_queues"("uid");
