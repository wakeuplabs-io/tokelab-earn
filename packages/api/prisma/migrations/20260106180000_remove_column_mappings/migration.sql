-- Rename tables from snake_case to PascalCase
ALTER TABLE "users" RENAME TO "User";
ALTER TABLE "investments" RENAME TO "Investment";
ALTER TABLE "investment_model_configs" RENAME TO "InvestmentModelConfig";
ALTER TABLE "blockchains" RENAME TO "Blockchain";
ALTER TABLE "transactions" RENAME TO "Transaction";
ALTER TABLE "investment_yields" RENAME TO "InvestmentYield";
ALTER TABLE "monthly_yields" RENAME TO "MonthlyYield";
ALTER TABLE "notifications" RENAME TO "Notification";
ALTER TABLE "user_preferences" RENAME TO "UserPreference";

-- Rename User columns from snake_case to camelCase
ALTER TABLE "User" RENAME COLUMN "auth0_id" TO "auth0Id";
ALTER TABLE "User" RENAME COLUMN "first_name" TO "firstName";
ALTER TABLE "User" RENAME COLUMN "last_name" TO "lastName";
ALTER TABLE "User" RENAME COLUMN "kyc_status" TO "kycStatus";
ALTER TABLE "User" RENAME COLUMN "kyc_provider_id" TO "kycProviderId";
ALTER TABLE "User" RENAME COLUMN "fireblocks_vault_id" TO "fireblocksVaultId";
ALTER TABLE "User" RENAME COLUMN "deposit_address" TO "depositAddress";
ALTER TABLE "User" RENAME COLUMN "available_balance" TO "availableBalance";
ALTER TABLE "User" RENAME COLUMN "locked_balance" TO "lockedBalance";
ALTER TABLE "User" RENAME COLUMN "is_blocked" TO "isBlocked";
ALTER TABLE "User" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "User" RENAME COLUMN "updated_at" TO "updatedAt";

-- Rename Investment columns from snake_case to camelCase
ALTER TABLE "Investment" RENAME COLUMN "user_id" TO "userId";
ALTER TABLE "Investment" RENAME COLUMN "model_config_id" TO "modelConfigId";
ALTER TABLE "Investment" RENAME COLUMN "duration_days" TO "durationDays";
ALTER TABLE "Investment" RENAME COLUMN "start_date" TO "startDate";
ALTER TABLE "Investment" RENAME COLUMN "end_date" TO "endDate";
ALTER TABLE "Investment" RENAME COLUMN "accrued_yield" TO "accruedYield";
ALTER TABLE "Investment" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "Investment" RENAME COLUMN "updated_at" TO "updatedAt";

-- Rename InvestmentModelConfig columns from snake_case to camelCase
ALTER TABLE "InvestmentModelConfig" RENAME COLUMN "min_investment" TO "minInvestment";
ALTER TABLE "InvestmentModelConfig" RENAME COLUMN "max_investment" TO "maxInvestment";
ALTER TABLE "InvestmentModelConfig" RENAME COLUMN "apr_initial" TO "aprInitial";
ALTER TABLE "InvestmentModelConfig" RENAME COLUMN "apr_final" TO "aprFinal";
ALTER TABLE "InvestmentModelConfig" RENAME COLUMN "apr_step_pct" TO "aprStepPct";
ALTER TABLE "InvestmentModelConfig" RENAME COLUMN "apr_step_period_days" TO "aprStepPeriodDays";
ALTER TABLE "InvestmentModelConfig" RENAME COLUMN "claim_period_days" TO "claimPeriodDays";
ALTER TABLE "InvestmentModelConfig" RENAME COLUMN "profit_share_investor" TO "profitShareInvestor";
ALTER TABLE "InvestmentModelConfig" RENAME COLUMN "withdrawal_period" TO "withdrawalPeriod";
ALTER TABLE "InvestmentModelConfig" RENAME COLUMN "early_withdrawal_penalty" TO "earlyWithdrawalPenalty";
ALTER TABLE "InvestmentModelConfig" RENAME COLUMN "is_current" TO "isCurrent";
ALTER TABLE "InvestmentModelConfig" RENAME COLUMN "created_at" TO "createdAt";

-- Rename Blockchain columns from snake_case to camelCase
ALTER TABLE "Blockchain" RENAME COLUMN "chain_id" TO "chainId";
ALTER TABLE "Blockchain" RENAME COLUMN "explorer_url" TO "explorerUrl";
ALTER TABLE "Blockchain" RENAME COLUMN "is_active" TO "isActive";

-- Rename Transaction columns from snake_case to camelCase
ALTER TABLE "Transaction" RENAME COLUMN "user_id" TO "userId";
ALTER TABLE "Transaction" RENAME COLUMN "blockchain_id" TO "blockchainId";
ALTER TABLE "Transaction" RENAME COLUMN "fireblocks_tx_id" TO "fireblocksTxId";
ALTER TABLE "Transaction" RENAME COLUMN "tx_hash" TO "txHash";
ALTER TABLE "Transaction" RENAME COLUMN "source_address" TO "sourceAddress";
ALTER TABLE "Transaction" RENAME COLUMN "destination_address" TO "destinationAddress";
ALTER TABLE "Transaction" RENAME COLUMN "network_fee" TO "networkFee";
ALTER TABLE "Transaction" RENAME COLUMN "failure_reason" TO "failureReason";
ALTER TABLE "Transaction" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "Transaction" RENAME COLUMN "processed_at" TO "processedAt";
ALTER TABLE "Transaction" RENAME COLUMN "completed_at" TO "completedAt";

-- Rename InvestmentYield columns from snake_case to camelCase
ALTER TABLE "InvestmentYield" RENAME COLUMN "investment_id" TO "investmentId";
ALTER TABLE "InvestmentYield" RENAME COLUMN "monthly_yield_id" TO "monthlyYieldId";
ALTER TABLE "InvestmentYield" RENAME COLUMN "gross_return" TO "grossReturn";
ALTER TABLE "InvestmentYield" RENAME COLUMN "active_days" TO "activeDays";
ALTER TABLE "InvestmentYield" RENAME COLUMN "paid_at" TO "paidAt";
ALTER TABLE "InvestmentYield" RENAME COLUMN "created_at" TO "createdAt";

-- Rename MonthlyYield columns from snake_case to camelCase
ALTER TABLE "MonthlyYield" RENAME COLUMN "actual_return_pct" TO "actualReturnPct";
ALTER TABLE "MonthlyYield" RENAME COLUMN "document_url" TO "documentUrl";
ALTER TABLE "MonthlyYield" RENAME COLUMN "uploaded_by" TO "uploadedBy";
ALTER TABLE "MonthlyYield" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "MonthlyYield" RENAME COLUMN "processed_at" TO "processedAt";

-- Rename Notification columns from snake_case to camelCase
ALTER TABLE "Notification" RENAME COLUMN "user_id" TO "userId";
ALTER TABLE "Notification" RENAME COLUMN "is_read" TO "isRead";
ALTER TABLE "Notification" RENAME COLUMN "created_at" TO "createdAt";

-- Rename UserPreference columns from snake_case to camelCase
ALTER TABLE "UserPreference" RENAME COLUMN "user_id" TO "userId";
ALTER TABLE "UserPreference" RENAME COLUMN "email_notifications" TO "emailNotifications";
ALTER TABLE "UserPreference" RENAME COLUMN "push_notifications" TO "pushNotifications";
ALTER TABLE "UserPreference" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "UserPreference" RENAME COLUMN "updated_at" TO "updatedAt";

-- Rename indexes (Prisma will recreate them but we need to drop old ones)
-- User indexes
DROP INDEX IF EXISTS "users_email_idx";
DROP INDEX IF EXISTS "users_auth0_id_idx";
DROP INDEX IF EXISTS "users_role_idx";
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_auth0Id_idx" ON "User"("auth0Id");
CREATE INDEX "User_role_idx" ON "User"("role");

-- Investment indexes
DROP INDEX IF EXISTS "investments_user_id_idx";
DROP INDEX IF EXISTS "investments_status_idx";
DROP INDEX IF EXISTS "investments_model_config_id_idx";
CREATE INDEX "Investment_userId_idx" ON "Investment"("userId");
CREATE INDEX "Investment_status_idx" ON "Investment"("status");
CREATE INDEX "Investment_modelConfigId_idx" ON "Investment"("modelConfigId");

-- InvestmentModelConfig indexes
DROP INDEX IF EXISTS "investment_model_configs_type_idx";
DROP INDEX IF EXISTS "investment_model_configs_is_current_idx";
DROP INDEX IF EXISTS "investment_model_configs_type_is_current_idx";
CREATE INDEX "InvestmentModelConfig_type_idx" ON "InvestmentModelConfig"("type");
CREATE INDEX "InvestmentModelConfig_isCurrent_idx" ON "InvestmentModelConfig"("isCurrent");
CREATE INDEX "InvestmentModelConfig_type_isCurrent_idx" ON "InvestmentModelConfig"("type", "isCurrent");

-- Transaction indexes
DROP INDEX IF EXISTS "transactions_user_id_idx";
DROP INDEX IF EXISTS "transactions_status_idx";
DROP INDEX IF EXISTS "transactions_type_idx";
DROP INDEX IF EXISTS "transactions_fireblocks_tx_id_idx";
DROP INDEX IF EXISTS "transactions_blockchain_id_idx";
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");
CREATE INDEX "Transaction_fireblocksTxId_idx" ON "Transaction"("fireblocksTxId");
CREATE INDEX "Transaction_blockchainId_idx" ON "Transaction"("blockchainId");

-- InvestmentYield indexes
DROP INDEX IF EXISTS "investment_yields_investment_id_idx";
DROP INDEX IF EXISTS "investment_yields_month_idx";
DROP INDEX IF EXISTS "investment_yields_status_idx";
DROP INDEX IF EXISTS "investment_yields_monthly_yield_id_idx";
CREATE INDEX "InvestmentYield_investmentId_idx" ON "InvestmentYield"("investmentId");
CREATE INDEX "InvestmentYield_month_idx" ON "InvestmentYield"("month");
CREATE INDEX "InvestmentYield_status_idx" ON "InvestmentYield"("status");
CREATE INDEX "InvestmentYield_monthlyYieldId_idx" ON "InvestmentYield"("monthlyYieldId");

-- Notification indexes
DROP INDEX IF EXISTS "notifications_user_id_idx";
DROP INDEX IF EXISTS "notifications_is_read_idx";
DROP INDEX IF EXISTS "notifications_created_at_idx";
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt" DESC);
