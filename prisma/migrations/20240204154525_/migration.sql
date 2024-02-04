/*
  Warnings:

  - You are about to drop the `KVStore` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "KVStore";

-- CreateTable
CREATE TABLE "kvs" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "kvs_key_key" ON "kvs"("key");
