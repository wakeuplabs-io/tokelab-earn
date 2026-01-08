-- Schema Refactor Migration
-- Changes:
-- 1. YieldStatus: PAID -> CLAIMED
-- 2. InvestmentYield: paidAt -> claimedAt
-- 3. InvestmentModelConfig: durations (Json) -> durationDays (Int)
-- 4. Investment: remove durationDays (now in config)
-- 5. User: remove depositAddress, availableBalance, lockedBalance
-- 6. New: Currency enum
-- 7. New: UserBalance table
-- 8. New: UserDepositAddress table
-- 9. Notification: add channel column
-- 10. UserPreference: Json -> Boolean for notifications

-- 1. Update YieldStatus enum: PAID -> CLAIMED
ALTER TYPE "YieldStatus" RENAME VALUE 'PAID' TO 'CLAIMED';

-- 2. Rename paidAt to claimedAt in InvestmentYield
ALTER TABLE "InvestmentYield" RENAME COLUMN "paidAt" TO "claimedAt";

-- 3. InvestmentModelConfig: add durationDays, drop durations
ALTER TABLE "InvestmentModelConfig" ADD COLUMN "durationDays" INTEGER;
UPDATE "InvestmentModelConfig" SET "durationDays" = 365 WHERE "durationDays" IS NULL;
ALTER TABLE "InvestmentModelConfig" ALTER COLUMN "durationDays" SET NOT NULL;
ALTER TABLE "InvestmentModelConfig" DROP COLUMN IF EXISTS "durations";

-- 4. Investment: remove durationDays
ALTER TABLE "Investment" DROP COLUMN IF EXISTS "durationDays";

-- 5. User: remove depositAddress, availableBalance, lockedBalance
ALTER TABLE "User" DROP COLUMN IF EXISTS "depositAddress";
ALTER TABLE "User" DROP COLUMN IF EXISTS "availableBalance";
ALTER TABLE "User" DROP COLUMN IF EXISTS "lockedBalance";

-- 6. Create Currency enum
CREATE TYPE "Currency" AS ENUM ('USDT', 'USDC');

-- 7. Create UserBalance table
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

CREATE UNIQUE INDEX "UserBalance_userId_currency_key" ON "UserBalance"("userId", "currency");
CREATE INDEX "UserBalance_userId_idx" ON "UserBalance"("userId");

ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 8. Create UserDepositAddress table
CREATE TABLE "UserDepositAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blockchainId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDepositAddress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserDepositAddress_userId_blockchainId_key" ON "UserDepositAddress"("userId", "blockchainId");
CREATE INDEX "UserDepositAddress_userId_idx" ON "UserDepositAddress"("userId");
CREATE INDEX "UserDepositAddress_blockchainId_idx" ON "UserDepositAddress"("blockchainId");

ALTER TABLE "UserDepositAddress" ADD CONSTRAINT "UserDepositAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UserDepositAddress" ADD CONSTRAINT "UserDepositAddress_blockchainId_fkey" FOREIGN KEY ("blockchainId") REFERENCES "Blockchain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 9. NotificationChannel enum and Notification.channel already created in previous migration

-- 10. UserPreference: already updated in previous migration
