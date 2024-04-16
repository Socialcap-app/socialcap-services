-- CreateTable
CREATE TABLE "tmpx" (
    "uid" TEXT NOT NULL,
    "community_uid" TEXT NOT NULL DEFAULT '',
    "person_uid" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT '0',
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_utc" TIMESTAMP(3),

    CONSTRAINT "tmpx_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "tmpx_uid_key" ON "tmpx"("uid");
