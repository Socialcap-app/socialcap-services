-- CreateTable
CREATE TABLE "merkle_map" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "root" BIGINT NOT NULL,
    "size" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merkle_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merkle_map_leaf" (
    "uid" TEXT NOT NULL,
    "merkle_map_id" INTEGER NOT NULL,
    "index" BIGINT NOT NULL,
    "key" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "data" TEXT,
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merkle_map_leaf_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "key_values" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "sessions" (
    "uid" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "persons" (
    "uid" TEXT NOT NULL,
    "account_id" TEXT,
    "state" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "image" TEXT DEFAULT '',
    "email" TEXT NOT NULL,
    "phone" TEXT DEFAULT '',
    "telegram" TEXT DEFAULT '',
    "preferences" TEXT DEFAULT '{}',
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "approved_utc" TIMESTAMP(3),

    CONSTRAINT "persons_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "communities" (
    "uid" TEXT NOT NULL,
    "account_id" TEXT,
    "admin_uid" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_utc" TIMESTAMP(3),
    "xadmins" TEXT DEFAULT '',

    CONSTRAINT "communities_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "members" (
    "uid" TEXT NOT NULL,
    "community_uid" TEXT NOT NULL DEFAULT '',
    "person_uid" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT '0',
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_utc" TIMESTAMP(3),

    CONSTRAINT "members_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "claims" (
    "uid" TEXT NOT NULL,
    "community_uid" TEXT NOT NULL,
    "applicant_uid" TEXT NOT NULL,
    "plan_uid" TEXT NOT NULL,
    "state" INTEGER NOT NULL,
    "account_id" TEXT,
    "alias" TEXT,
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "voted_utc" TIMESTAMP(3),
    "issued_utc" TIMESTAMP(3),
    "due_utc" TIMESTAMP(3),
    "required_votes" INTEGER DEFAULT 0,
    "required_positives" INTEGER DEFAULT 0,
    "positive_votes" INTEGER DEFAULT 0,
    "negative_votes" INTEGER DEFAULT 0,
    "ignored_votes" INTEGER DEFAULT 0,
    "evidence_data" TEXT DEFAULT '',

    CONSTRAINT "claims_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "plans" (
    "uid" TEXT NOT NULL,
    "community_uid" TEXT NOT NULL,
    "state" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "alias" TEXT,
    "description" TEXT DEFAULT '',
    "image" TEXT DEFAULT '',
    "template" TEXT DEFAULT '',
    "evidence" TEXT DEFAULT '[]',
    "strategy" TEXT DEFAULT '{}',
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_utc" TIMESTAMP(3),
    "fee" INTEGER DEFAULT 0,
    "payed_by" INTEGER DEFAULT 1,
    "rewards_share" INTEGER DEFAULT 0,
    "community_share" INTEGER DEFAULT 0,
    "protocol_share" INTEGER DEFAULT 0,
    "total" INTEGER DEFAULT 1,
    "available" INTEGER DEFAULT 1,
    "expiration" INTEGER DEFAULT 0,
    "revocable" BOOLEAN DEFAULT false,
    "starts_utc" TIMESTAMP(3),
    "ends_utc" TIMESTAMP(3),
    "voting_starts_utc" TIMESTAMP(3),
    "voting_ends_utc" TIMESTAMP(3),

    CONSTRAINT "plans_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "credentials" (
    "uid" TEXT NOT NULL,
    "credential_id" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "applicant_uid" TEXT NOT NULL,
    "community_uid" TEXT NOT NULL,
    "claim_uid" TEXT NOT NULL,
    "type" TEXT DEFAULT '',
    "description" TEXT DEFAULT '',
    "community" TEXT DEFAULT '',
    "image" TEXT DEFAULT '',
    "alias" TEXT DEFAULT '',
    "stars" INTEGER DEFAULT 0,
    "metadata" TEXT DEFAULT '{}',
    "revocable" BOOLEAN DEFAULT false,
    "issued_utc" TIMESTAMP(3),
    "expires _utc" TIMESTAMP(3),

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "tasks" (
    "uid" TEXT NOT NULL,
    "plan_uid" TEXT NOT NULL DEFAULT '',
    "claim_uid" TEXT NOT NULL,
    "assignee_uid" TEXT NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 0,
    "assigned_utc" TIMESTAMP(3),
    "completed_utc" TIMESTAMP(3),
    "due_utc" TIMESTAMP(3),
    "rewarded" INTEGER DEFAULT 0,
    "reason" INTEGER DEFAULT 0,
    "result" TEXT DEFAULT '7',

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "proposeds" (
    "uid" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "person_uid" TEXT NOT NULL,
    "community_uid" TEXT NOT NULL,
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposeds_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "batches" (
    "uid" TEXT NOT NULL,
    "sequence" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'NONE',
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "signer_account_id" TEXT NOT NULL,
    "signed_data" TEXT NOT NULL DEFAULT '',
    "signature_field" TEXT NOT NULL DEFAULT '',
    "signature_scalar" TEXT NOT NULL DEFAULT '',
    "commitment" TEXT NOT NULL DEFAULT '',
    "size" INTEGER NOT NULL DEFAULT 0,
    "state" INTEGER NOT NULL DEFAULT 9,
    "submited_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "done_utc" TIMESTAMP(3),
    "batches_account_id" TEXT DEFAULT '',
    "batch_received_txn_uid" TEXT DEFAULT '',
    "batches_commited_txn_uid" TEXT DEFAULT '',

    CONSTRAINT "batches_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "states" (
    "id" INTEGER NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_queues" (
    "uid" TEXT NOT NULL,
    "sequence" SERIAL NOT NULL,
    "queue" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "data" TEXT NOT NULL DEFAULT '{}',
    "state" INTEGER NOT NULL DEFAULT 9,
    "received_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submited_utc" TIMESTAMP(3),
    "retried_utc" TIMESTAMP(3),
    "done_utc" TIMESTAMP(3),
    "retries" INTEGER NOT NULL DEFAULT 0,
    "txn_hash" TEXT NOT NULL DEFAULT '',
    "txn_done" TEXT NOT NULL DEFAULT '',
    "txn_error" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "transaction_queues_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "transaction_events" (
    "sequence" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT '',
    "subject" TEXT NOT NULL DEFAULT '',
    "payload" TEXT NOT NULL DEFAULT '{}',
    "state" INTEGER DEFAULT 9,
    "emitted_utc" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_events_pkey" PRIMARY KEY ("sequence")
);

-- CreateIndex
CREATE UNIQUE INDEX "key_values_key_key" ON "key_values"("key");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_uid_key" ON "sessions"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "persons_uid_key" ON "persons"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "persons_email_key" ON "persons"("email");

-- CreateIndex
CREATE UNIQUE INDEX "communities_uid_key" ON "communities"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "members_uid_key" ON "members"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "claims_uid_key" ON "claims"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "plans_uid_key" ON "plans"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_uid_key" ON "credentials"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_uid_key" ON "tasks"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "proposeds_uid_key" ON "proposeds"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "batches_uid_key" ON "batches"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "states_id_key" ON "states"("id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_queues_uid_key" ON "transaction_queues"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_events_sequence_key" ON "transaction_events"("sequence");
