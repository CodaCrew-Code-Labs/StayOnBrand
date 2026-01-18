-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'ON_HOLD', 'FAILED', 'CANCELLED', 'EXPIRED', 'GRACE');

-- CreateEnum
CREATE TYPE "PlanChangeStatus" AS ENUM ('PENDING', 'COMPLETED', 'PAYMENT_NEEDED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';
ALTER TYPE "PaymentStatus" ADD VALUE 'DISPUTED';
ALTER TYPE "PaymentStatus" ADD VALUE 'AUTO_DELETED';

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "payment_link" TEXT;

-- AlterTable
ALTER TABLE "user_mapping" ADD COLUMN     "active_length" VARCHAR(50),
ADD COLUMN     "pending_active_length" VARCHAR(50),
ADD COLUMN     "pending_change_type" VARCHAR(50),
ADD COLUMN     "pending_product_id" VARCHAR(100),
ADD COLUMN     "pending_tier" VARCHAR(50),
ADD COLUMN     "pending_tier_effective_date" TIMESTAMP(3),
ADD COLUMN     "plan_change_initiated_at" TIMESTAMP(3),
ADD COLUMN     "plan_change_status" "PlanChangeStatus",
ADD COLUMN     "subscription_id" VARCHAR(100),
ADD COLUMN     "subscription_status" "SubscriptionStatus";
