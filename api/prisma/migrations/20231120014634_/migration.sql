-- CreateTable
CREATE TABLE "transaction_events" (
    "sequence" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT '',
    "to" TEXT NOT NULL DEFAULT '',
    "payload" TEXT NOT NULL DEFAULT '{}',
    "state" INTEGER DEFAULT 9,
    "emitted_utc" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_events_pkey" PRIMARY KEY ("sequence")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_events_sequence_key" ON "transaction_events"("sequence");
