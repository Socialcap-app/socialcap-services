-- AlterTable
ALTER TABLE "batches" ADD COLUMN     "signed_data" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "signed_scalar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "signed_signature" TEXT NOT NULL DEFAULT '';
