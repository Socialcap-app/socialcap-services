-- CreateTable
CREATE TABLE "batches" (
    "uid" TEXT NOT NULL,
    "sequence" SERIAL NOT NULL,
    "community_uid" TEXT NOT NULL,
    "plan_uid" TEXT NOT NULL,
    "assignee_uid" TEXT NOT NULL,
    "elector_account_id" TEXT NOT NULL,
    "submited_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commitment" TEXT NOT NULL DEFAULT '',
    "size" INTEGER NOT NULL DEFAULT 0,
    "state" INTEGER NOT NULL DEFAULT 9,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "batches_uid_key" ON "batches"("uid");
