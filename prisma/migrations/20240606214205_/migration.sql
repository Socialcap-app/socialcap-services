-- CreateTable
CREATE TABLE "notifications" (
    "uid" TEXT NOT NULL,
    "sequence" SERIAL NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'private',
    "type" TEXT NOT NULL DEFAULT 'message',
    "text" TEXT NOT NULL DEFAULT '',
    "state" INTEGER NOT NULL DEFAULT 0,
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "created_utc" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "notifications_uid_key" ON "notifications"("uid");
