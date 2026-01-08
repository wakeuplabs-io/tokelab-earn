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
CREATE TYPE "YieldStatus" AS ENUM ('PENDING', 'CLAIMED');

-- CreateEnum
CREATE TYPE "MonthlyYieldStatus" AS ENUM ('PENDING', 'PROCESSED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'IN_APP');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USDT', 'USDC');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "auth0Id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'INVESTOR',
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "kycProviderId" TEXT,
    "fireblocksVaultId" TEXT,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBalance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "available" DECIMAL(20,6) NOT NULL DEFAULT 0,
    "locked" DECIMAL(20,6) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDepositAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blockchainId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDepositAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "modelConfigId" TEXT NOT NULL,
    "amount" DECIMAL(20,6) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USDT',
    "status" "InvestmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "accruedYield" DECIMAL(20,6) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentModelConfig" (
    "id" TEXT NOT NULL,
    "type" "InvestmentModelType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "minInvestment" DECIMAL(20,6) NOT NULL,
    "maxInvestment" DECIMAL(20,6),
    "durationDays" INTEGER NOT NULL,
    "aprInitial" DECIMAL(5,2),
    "aprFinal" DECIMAL(5,2),
    "aprStepPct" DECIMAL(5,2),
    "aprStepPeriodDays" INTEGER,
    "claimPeriodDays" INTEGER,
    "profitShareInvestor" DECIMAL(5,2),
    "withdrawalPeriod" INTEGER,
    "earlyWithdrawalPenalty" DECIMAL(5,2),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentModelConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blockchain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "chainId" INTEGER,
    "explorerUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Blockchain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blockchainId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(20,6) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USDT',
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "fireblocksTxId" TEXT,
    "txHash" TEXT,
    "sourceAddress" TEXT,
    "destinationAddress" TEXT,
    "networkFee" DECIMAL(20,6),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentYield" (
    "id" TEXT NOT NULL,
    "investmentId" TEXT NOT NULL,
    "monthlyYieldId" TEXT,
    "month" TEXT NOT NULL,
    "grossReturn" DECIMAL(5,2),
    "activeDays" INTEGER,
    "amount" DECIMAL(20,6) NOT NULL,
    "status" "YieldStatus" NOT NULL DEFAULT 'PENDING',
    "claimedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentYield_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyYield" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "actualReturnPct" DECIMAL(5,2) NOT NULL,
    "documentUrl" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "status" "MonthlyYieldStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "MonthlyYield_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "templateId" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "inAppNotifications" BOOLEAN NOT NULL DEFAULT true,
    "language" TEXT NOT NULL DEFAULT 'es',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_auth0Id_key" ON "User"("auth0Id");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_auth0Id_idx" ON "User"("auth0Id");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "UserBalance_userId_idx" ON "UserBalance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBalance_userId_currency_key" ON "UserBalance"("userId", "currency");

-- CreateIndex
CREATE INDEX "UserDepositAddress_userId_idx" ON "UserDepositAddress"("userId");

-- CreateIndex
CREATE INDEX "UserDepositAddress_blockchainId_idx" ON "UserDepositAddress"("blockchainId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDepositAddress_userId_blockchainId_key" ON "UserDepositAddress"("userId", "blockchainId");

-- CreateIndex
CREATE INDEX "Investment_userId_idx" ON "Investment"("userId");

-- CreateIndex
CREATE INDEX "Investment_status_idx" ON "Investment"("status");

-- CreateIndex
CREATE INDEX "Investment_modelConfigId_idx" ON "Investment"("modelConfigId");

-- CreateIndex
CREATE INDEX "InvestmentModelConfig_type_idx" ON "InvestmentModelConfig"("type");

-- CreateIndex
CREATE INDEX "InvestmentModelConfig_isCurrent_idx" ON "InvestmentModelConfig"("isCurrent");

-- CreateIndex
CREATE INDEX "InvestmentModelConfig_type_isCurrent_idx" ON "InvestmentModelConfig"("type", "isCurrent");

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_name_key" ON "Blockchain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_symbol_key" ON "Blockchain"("symbol");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_fireblocksTxId_idx" ON "Transaction"("fireblocksTxId");

-- CreateIndex
CREATE INDEX "Transaction_blockchainId_idx" ON "Transaction"("blockchainId");

-- CreateIndex
CREATE INDEX "InvestmentYield_investmentId_idx" ON "InvestmentYield"("investmentId");

-- CreateIndex
CREATE INDEX "InvestmentYield_month_idx" ON "InvestmentYield"("month");

-- CreateIndex
CREATE INDEX "InvestmentYield_status_idx" ON "InvestmentYield"("status");

-- CreateIndex
CREATE INDEX "InvestmentYield_monthlyYieldId_idx" ON "InvestmentYield"("monthlyYieldId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentYield_investmentId_month_key" ON "InvestmentYield"("investmentId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyYield_month_key" ON "MonthlyYield"("month");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_channel_idx" ON "Notification"("channel");

-- CreateIndex
CREATE INDEX "Notification_templateId_idx" ON "Notification"("templateId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDepositAddress" ADD CONSTRAINT "UserDepositAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDepositAddress" ADD CONSTRAINT "UserDepositAddress_blockchainId_fkey" FOREIGN KEY ("blockchainId") REFERENCES "Blockchain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_modelConfigId_fkey" FOREIGN KEY ("modelConfigId") REFERENCES "InvestmentModelConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_blockchainId_fkey" FOREIGN KEY ("blockchainId") REFERENCES "Blockchain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentYield" ADD CONSTRAINT "InvestmentYield_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentYield" ADD CONSTRAINT "InvestmentYield_monthlyYieldId_fkey" FOREIGN KEY ("monthlyYieldId") REFERENCES "MonthlyYield"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyYield" ADD CONSTRAINT "MonthlyYield_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
