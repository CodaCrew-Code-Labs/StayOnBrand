-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "SessionMode" AS ENUM ('SUBSCRIPTION', 'ONE_TIME');

-- CreateTable
CREATE TABLE "user_mapping" (
    "user_uuid" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "dodo_customer_id" TEXT,
    "active_tier" VARCHAR(50),
    "tier_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_mapping_pkey" PRIMARY KEY ("user_uuid")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL,
    "mode" "SessionMode",
    "requested_tier" VARCHAR(50),
    "payment_id" TEXT,
    "subscription_id" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "session_id" TEXT,
    "dodo_payment_id" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "amount_cents" INTEGER,
    "currency" CHAR(3),
    "tier" VARCHAR(50),
    "dodo_subscription_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "paid_at" TIMESTAMP(3),
    "raw_json" JSONB,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_mapping_email_key" ON "user_mapping"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_id_key" ON "sessions"("session_id");

-- CreateIndex
CREATE INDEX "sessions_user_uuid_created_date_idx" ON "sessions"("user_uuid", "created_date");

-- CreateIndex
CREATE UNIQUE INDEX "payments_dodo_payment_id_key" ON "payments"("dodo_payment_id");

-- CreateIndex
CREATE INDEX "payments_user_uuid_created_at_idx" ON "payments"("user_uuid", "created_at");

-- CreateIndex
CREATE INDEX "payments_session_id_idx" ON "payments"("session_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user_mapping"("user_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user_mapping"("user_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("session_id") ON DELETE SET NULL ON UPDATE CASCADE;
