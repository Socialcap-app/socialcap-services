/*
  Warnings:

  - You are about to drop the `kvs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "kvs";

-- CreateTable
CREATE TABLE "key_values" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "key_values_key_key" ON "key_values"("key");
