-- CreateTable
CREATE TABLE "KVStore" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "KVStore_key_key" ON "KVStore"("key");
