/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vault` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('INVESTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvestmentModelType" AS ENUM ('FIXED', 'VARIABLE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "YieldStatus" AS ENUM ('PENDING', 'PAID');

-- CreateEnum
CREATE TYPE "MonthlyYieldStatus" AS ENUM ('PENDING', 'PROCESSED');

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Vault";

-- DropEnum
DROP TYPE "VaultStatus";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "auth0_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'INVESTOR',
    "kyc_status" "KycStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "kyc_provider_id" TEXT,
    "fireblocks_vault_id" TEXT,
    "deposit_address" TEXT,
    "available_balance" DECIMAL(20,6) NOT NULL DEFAULT 0,
    "locked_balance" DECIMAL(20,6) NOT NULL DEFAULT 0,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "model_config_id" TEXT NOT NULL,
    "amount" DECIMAL(20,6) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USDT',
    "duration_days" INTEGER NOT NULL,
    "status" "InvestmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "accrued_yield" DECIMAL(20,6) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_model_configs" (
    "id" TEXT NOT NULL,
    "type" "InvestmentModelType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "min_investment" DECIMAL(20,6) NOT NULL,
    "max_investment" DECIMAL(20,6),
    "durations" JSONB,
    "apr_initial" DECIMAL(5,2),
    "apr_final" DECIMAL(5,2),
    "apr_step_pct" DECIMAL(5,2),
    "apr_step_period_days" INTEGER,
    "profit_share_investor" DECIMAL(5,2),
    "withdrawal_period" INTEGER,
    "early_withdrawal_penalty" DECIMAL(5,2),
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investment_model_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockchains" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "chain_id" INTEGER,
    "explorer_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "blockchains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "blockchain_id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(20,6) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USDT',
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "fireblocks_tx_id" TEXT,
    "tx_hash" TEXT,
    "source_address" TEXT,
    "destination_address" TEXT,
    "network_fee" DECIMAL(20,6),
    "failure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_yields" (
    "id" TEXT NOT NULL,
    "investment_id" TEXT NOT NULL,
    "monthly_yield_id" TEXT,
    "month" TEXT NOT NULL,
    "gross_return" DECIMAL(5,2),
    "active_days" INTEGER,
    "amount" DECIMAL(20,6) NOT NULL,
    "status" "YieldStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investment_yields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_yields" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "actual_return_pct" DECIMAL(5,2) NOT NULL,
    "document_url" TEXT,
    "uploaded_by" TEXT NOT NULL,
    "status" "MonthlyYieldStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "monthly_yields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email_notifications" JSONB NOT NULL DEFAULT '{}',
    "push_notifications" JSONB NOT NULL DEFAULT '{}',
    "language" TEXT NOT NULL DEFAULT 'es',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_auth0_id_key" ON "users"("auth0_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_auth0_id_idx" ON "users"("auth0_id");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "investments_user_id_idx" ON "investments"("user_id");

-- CreateIndex
CREATE INDEX "investments_status_idx" ON "investments"("status");

-- CreateIndex
CREATE INDEX "investments_model_config_id_idx" ON "investments"("model_config_id");

-- CreateIndex
CREATE INDEX "investment_model_configs_type_idx" ON "investment_model_configs"("type");

-- CreateIndex
CREATE INDEX "investment_model_configs_is_current_idx" ON "investment_model_configs"("is_current");

-- CreateIndex
CREATE INDEX "investment_model_configs_type_is_current_idx" ON "investment_model_configs"("type", "is_current");

-- CreateIndex
CREATE UNIQUE INDEX "blockchains_name_key" ON "blockchains"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blockchains_symbol_key" ON "blockchains"("symbol");

-- CreateIndex
CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_fireblocks_tx_id_idx" ON "transactions"("fireblocks_tx_id");

-- CreateIndex
CREATE INDEX "transactions_blockchain_id_idx" ON "transactions"("blockchain_id");

-- CreateIndex
CREATE INDEX "investment_yields_investment_id_idx" ON "investment_yields"("investment_id");

-- CreateIndex
CREATE INDEX "investment_yields_month_idx" ON "investment_yields"("month");

-- CreateIndex
CREATE INDEX "investment_yields_status_idx" ON "investment_yields"("status");

-- CreateIndex
CREATE INDEX "investment_yields_monthly_yield_id_idx" ON "investment_yields"("monthly_yield_id");

-- CreateIndex
CREATE UNIQUE INDEX "investment_yields_investment_id_month_key" ON "investment_yields"("investment_id", "month");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_yields_month_key" ON "monthly_yields"("month");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_model_config_id_fkey" FOREIGN KEY ("model_config_id") REFERENCES "investment_model_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_blockchain_id_fkey" FOREIGN KEY ("blockchain_id") REFERENCES "blockchains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_yields" ADD CONSTRAINT "investment_yields_investment_id_fkey" FOREIGN KEY ("investment_id") REFERENCES "investments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_yields" ADD CONSTRAINT "investment_yields_monthly_yield_id_fkey" FOREIGN KEY ("monthly_yield_id") REFERENCES "monthly_yields"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_yields" ADD CONSTRAINT "monthly_yields_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
