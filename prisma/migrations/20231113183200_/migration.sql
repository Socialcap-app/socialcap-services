-- CreateTable
CREATE TABLE "states" (
    "id" INTEGER NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "states_id_key" ON "states"("id");
