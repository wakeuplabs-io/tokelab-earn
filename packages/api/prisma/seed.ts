import { PrismaClient } from "../src/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

// Fixed UUIDs for predictable testing
const IDS = {
  // Blockchains
  BLOCKCHAIN_ETH: "11111111-1111-1111-1111-111111111001",
  BLOCKCHAIN_BSC: "11111111-1111-1111-1111-111111111002",
  BLOCKCHAIN_TRON: "11111111-1111-1111-1111-111111111003",
  BLOCKCHAIN_POLYGON: "11111111-1111-1111-1111-111111111004",
  BLOCKCHAIN_ARBITRUM: "11111111-1111-1111-1111-111111111005",
  BLOCKCHAIN_SOLANA: "11111111-1111-1111-1111-111111111006",

  // Users
  USER_ADMIN: "22222222-2222-2222-2222-222222222001",
  USER_INVESTOR1: "22222222-2222-2222-2222-222222222002",
  USER_INVESTOR2: "22222222-2222-2222-2222-222222222003",
  USER_INVESTOR3: "22222222-2222-2222-2222-222222222004",
  USER_INVESTOR4: "22222222-2222-2222-2222-222222222005",

  // Investment Model Configs
  MODEL_FIXED: "33333333-3333-3333-3333-333333333001",
  MODEL_VARIABLE: "33333333-3333-3333-3333-333333333002",

  // Investments
  INV_FIXED_ACTIVE_1: "44444444-4444-4444-4444-444444444001",
  INV_FIXED_ACTIVE_2: "44444444-4444-4444-4444-444444444002",
  INV_VARIABLE_ACTIVE: "44444444-4444-4444-4444-444444444003",
  INV_FIXED_COMPLETED: "44444444-4444-4444-4444-444444444004",
  INV_FIXED_INVESTOR2: "44444444-4444-4444-4444-444444444005",
  INV_CANCELLED: "44444444-4444-4444-4444-444444444006",
  INV_FIXED_ACTIVE_3: "44444444-4444-4444-4444-444444444007",
  INV_FIXED_ACTIVE_4: "44444444-4444-4444-4444-444444444008",
  INV_VARIABLE_ACTIVE_2: "44444444-4444-4444-4444-444444444009",
  INV_VARIABLE_ACTIVE_3: "44444444-4444-4444-4444-444444444010",
  INV_FIXED_COMPLETED_2: "44444444-4444-4444-4444-444444444011",
  INV_FIXED_COMPLETED_3: "44444444-4444-4444-4444-444444444012",
  INV_VARIABLE_COMPLETED: "44444444-4444-4444-4444-444444444013",
  INV_CANCELLED_2: "44444444-4444-4444-4444-444444444014",
  INV_FIXED_INVESTOR3: "44444444-4444-4444-4444-444444444015",

  // Monthly Yields
  MONTHLY_YIELD_1: "55555555-5555-5555-5555-555555555001",
  MONTHLY_YIELD_2: "55555555-5555-5555-5555-555555555002",
  MONTHLY_YIELD_3: "55555555-5555-5555-5555-555555555003",
};

// Helper to get dates relative to now
function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function getMonth(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedBlockchains() {
  console.log("Seeding blockchains...");

  const blockchains = [
    {
      id: IDS.BLOCKCHAIN_ETH,
      name: "Ethereum",
      symbol: "ERC20",
      chainId: 1,
      explorerUrl: "https://etherscan.io",
      isActive: true,
    },
    {
      id: IDS.BLOCKCHAIN_BSC,
      name: "BNB Smart Chain",
      symbol: "BEP20",
      chainId: 56,
      explorerUrl: "https://bscscan.com",
      isActive: true,
    },
    {
      id: IDS.BLOCKCHAIN_TRON,
      name: "Tron",
      symbol: "TRC20",
      chainId: null,
      explorerUrl: "https://tronscan.org",
      isActive: true,
    },
    {
      id: IDS.BLOCKCHAIN_POLYGON,
      name: "Polygon",
      symbol: "POLYGON",
      chainId: 137,
      explorerUrl: "https://polygonscan.com",
      isActive: true,
    },
    {
      id: IDS.BLOCKCHAIN_ARBITRUM,
      name: "Arbitrum",
      symbol: "ARB",
      chainId: 42161,
      explorerUrl: "https://arbiscan.io",
      isActive: true,
    },
    {
      id: IDS.BLOCKCHAIN_SOLANA,
      name: "Solana",
      symbol: "SOL",
      chainId: null,
      explorerUrl: "https://solscan.io",
      isActive: true,
    },
  ];

  for (const blockchain of blockchains) {
    await prisma.blockchain.create({ data: blockchain });
  }

  console.log(`  ✓ Created ${blockchains.length} blockchains`);
  return blockchains;
}

async function seedUsers() {
  console.log("Seeding users...");

  const admin = await prisma.user.create({
    data: {
      id: IDS.USER_ADMIN,
      email: "admin@tokelab.com",
      auth0Id: "auth0|admin001",
      firstName: "Admin",
      lastName: "Tokelab",
      phone: "+1234567890",
      role: "ADMIN",
      kycStatus: "VERIFIED",
      kycProviderId: "sumsub_admin_001",
      fireblocksVaultId: "vault_admin_001",
      depositAddress: "0xAdminDepositAddress1234567890123456789012",
      availableBalance: new Decimal("0"),
      lockedBalance: new Decimal("0"),
      isBlocked: false,
    },
  });

  const investor1 = await prisma.user.create({
    data: {
      id: IDS.USER_INVESTOR1,
      email: "investor1@example.com",
      auth0Id: "auth0|investor001",
      firstName: "Juan",
      lastName: "Pérez",
      phone: "+5491123456789",
      role: "INVESTOR",
      kycStatus: "VERIFIED",
      kycProviderId: "sumsub_inv_001",
      fireblocksVaultId: "vault_inv_001",
      depositAddress: "0xInvestor1DepositAddress12345678901234567890",
      availableBalance: new Decimal("15000.000000"),
      lockedBalance: new Decimal("35000.000000"),
      isBlocked: false,
    },
  });

  const investor2 = await prisma.user.create({
    data: {
      id: IDS.USER_INVESTOR2,
      email: "investor2@example.com",
      auth0Id: "auth0|investor002",
      firstName: "María",
      lastName: "García",
      phone: "+5491198765432",
      role: "INVESTOR",
      kycStatus: "IN_PROGRESS",
      kycProviderId: "sumsub_inv_002",
      fireblocksVaultId: "vault_inv_002",
      depositAddress: "0xInvestor2DepositAddress12345678901234567890",
      availableBalance: new Decimal("5000.000000"),
      lockedBalance: new Decimal("10000.000000"),
      isBlocked: false,
    },
  });

  const investor3 = await prisma.user.create({
    data: {
      id: IDS.USER_INVESTOR3,
      email: "investor3@example.com",
      auth0Id: "auth0|investor003",
      firstName: "Carlos",
      lastName: "López",
      phone: null,
      role: "INVESTOR",
      kycStatus: "NOT_STARTED",
      kycProviderId: null,
      fireblocksVaultId: "vault_inv_003",
      depositAddress: "0xInvestor3DepositAddress12345678901234567890",
      availableBalance: new Decimal("1000.000000"),
      lockedBalance: new Decimal("0"),
      isBlocked: false,
    },
  });

  const investor4 = await prisma.user.create({
    data: {
      id: IDS.USER_INVESTOR4,
      email: "investor4@example.com",
      auth0Id: "auth0|investor004",
      firstName: "Ana",
      lastName: "Martínez",
      phone: "+5491155554444",
      role: "INVESTOR",
      kycStatus: "VERIFIED",
      kycProviderId: "sumsub_inv_004",
      fireblocksVaultId: "vault_inv_004",
      depositAddress: "0xInvestor4DepositAddress12345678901234567890",
      availableBalance: new Decimal("0"),
      lockedBalance: new Decimal("0"),
      isBlocked: true, // Blocked user
    },
  });

  console.log("  ✓ Created 5 users (1 admin + 4 investors)");
  return { admin, investor1, investor2, investor3, investor4 };
}

async function seedInvestmentModelConfigs() {
  console.log("Seeding investment model configs...");

  const fixedModel = await prisma.investmentModelConfig.create({
    data: {
      id: IDS.MODEL_FIXED,
      type: "FIXED",
      name: "Fixed APR Investment",
      description: "Earn progressive APR starting at 8% and increasing to 12% over time",
      minInvestment: new Decimal("100.000000"),
      maxInvestment: new Decimal("100000.000000"),
      durations: [
        { days: 180, label: "6 months" },
        { days: 365, label: "1 year" },
        { days: 730, label: "2 years" },
      ],
      aprInitial: new Decimal("8.00"),
      aprFinal: new Decimal("12.00"),
      aprStepPct: new Decimal("1.00"),
      aprStepPeriodDays: 30,
      claimPeriodDays: 60, // Yields can be claimed every 60 days
      profitShareInvestor: null,
      withdrawalPeriod: 30,
      earlyWithdrawalPenalty: new Decimal("5.00"),
      isCurrent: true,
      version: 1,
    },
  });

  const variableModel = await prisma.investmentModelConfig.create({
    data: {
      id: IDS.MODEL_VARIABLE,
      type: "VARIABLE",
      name: "Variable Profit Share",
      description: "Earn 60% of the trading bot profits each month",
      minInvestment: new Decimal("500.000000"),
      maxInvestment: null,
      durations: [
        { days: 90, label: "3 months" },
        { days: 180, label: "6 months" },
        { days: 365, label: "1 year" },
      ],
      aprInitial: null,
      aprFinal: null,
      aprStepPct: null,
      aprStepPeriodDays: null,
      profitShareInvestor: new Decimal("60.00"),
      withdrawalPeriod: 15,
      earlyWithdrawalPenalty: new Decimal("3.00"),
      isCurrent: true,
      version: 1,
    },
  });

  console.log("  ✓ Created 2 investment model configs (FIXED + VARIABLE)");
  return { fixedModel, variableModel };
}

async function seedInvestments(
  users: Awaited<ReturnType<typeof seedUsers>>,
  models: Awaited<ReturnType<typeof seedInvestmentModelConfigs>>,
) {
  console.log("Seeding investments...");

  const investments = [];

  // Investment 1: FIXED active - investor1 - started 3 months ago
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_FIXED_ACTIVE_1,
        userId: users.investor1.id,
        modelConfigId: models.fixedModel.id,
        amount: new Decimal("10000.000000"),
        currency: "USDT",
        durationDays: 365,
        status: "ACTIVE",
        startDate: daysAgo(90),
        endDate: daysFromNow(275),
        accruedYield: new Decimal("200.000000"),
      },
    }),
  );

  // Investment 2: FIXED active - investor1 - started 1 month ago
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_FIXED_ACTIVE_2,
        userId: users.investor1.id,
        modelConfigId: models.fixedModel.id,
        amount: new Decimal("5000.000000"),
        currency: "USDT",
        durationDays: 180,
        status: "ACTIVE",
        startDate: daysAgo(30),
        endDate: daysFromNow(150),
        accruedYield: new Decimal("33.333333"),
      },
    }),
  );

  // Investment 3: VARIABLE active - investor1 - started 2 months ago
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_VARIABLE_ACTIVE,
        userId: users.investor1.id,
        modelConfigId: models.variableModel.id,
        amount: new Decimal("20000.000000"),
        currency: "USDT",
        durationDays: 365,
        status: "ACTIVE",
        startDate: daysAgo(60),
        endDate: daysFromNow(305),
        accruedYield: new Decimal("480.000000"),
      },
    }),
  );

  // Investment 4: FIXED completed - investor1 - finished 15 days ago
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_FIXED_COMPLETED,
        userId: users.investor1.id,
        modelConfigId: models.fixedModel.id,
        amount: new Decimal("3000.000000"),
        currency: "USDT",
        durationDays: 180,
        status: "COMPLETED",
        startDate: daysAgo(195),
        endDate: daysAgo(15),
        accruedYield: new Decimal("150.000000"),
      },
    }),
  );

  // Investment 5: FIXED active - investor2 (KYC in progress)
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_FIXED_INVESTOR2,
        userId: users.investor2.id,
        modelConfigId: models.fixedModel.id,
        amount: new Decimal("10000.000000"),
        currency: "USDT",
        durationDays: 365,
        status: "ACTIVE",
        startDate: daysAgo(45),
        endDate: daysFromNow(320),
        accruedYield: new Decimal("100.000000"),
      },
    }),
  );

  // Investment 6: Cancelled - investor1
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_CANCELLED,
        userId: users.investor1.id,
        modelConfigId: models.fixedModel.id,
        amount: new Decimal("2000.000000"),
        currency: "USDT",
        durationDays: 180,
        status: "CANCELLED",
        startDate: daysAgo(60),
        endDate: daysAgo(30), // Cancelled early
        accruedYield: new Decimal("0"),
      },
    }),
  );

  // Investment 7: FIXED active - investor1 - started 4 months ago
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_FIXED_ACTIVE_3,
        userId: users.investor1.id,
        modelConfigId: models.fixedModel.id,
        amount: new Decimal("8000.000000"),
        currency: "USDT",
        durationDays: 365,
        status: "ACTIVE",
        startDate: daysAgo(120),
        endDate: daysFromNow(245),
        accruedYield: new Decimal("320.000000"),
      },
    }),
  );

  // Investment 8: FIXED active - investor2 - started 6 months ago
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_FIXED_ACTIVE_4,
        userId: users.investor2.id,
        modelConfigId: models.fixedModel.id,
        amount: new Decimal("15000.000000"),
        currency: "USDT",
        durationDays: 365,
        status: "ACTIVE",
        startDate: daysAgo(180),
        endDate: daysFromNow(185),
        accruedYield: new Decimal("900.000000"),
      },
    }),
  );

  // Investment 9: VARIABLE active - investor1 - started 5 months ago
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_VARIABLE_ACTIVE_2,
        userId: users.investor1.id,
        modelConfigId: models.variableModel.id,
        amount: new Decimal("25000.000000"),
        currency: "USDT",
        durationDays: 365,
        status: "ACTIVE",
        startDate: daysAgo(150),
        endDate: daysFromNow(215),
        accruedYield: new Decimal("1250.000000"),
      },
    }),
  );

  // Investment 10: VARIABLE active - investor3 - started 200 days ago
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_VARIABLE_ACTIVE_3,
        userId: users.investor3.id,
        modelConfigId: models.variableModel.id,
        amount: new Decimal("12000.000000"),
        currency: "USDT",
        durationDays: 365,
        status: "ACTIVE",
        startDate: daysAgo(200),
        endDate: daysFromNow(165),
        accruedYield: new Decimal("720.000000"),
      },
    }),
  );

  // Investment 11: FIXED completed - investor1 - finished 35 days ago
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_FIXED_COMPLETED_2,
        userId: users.investor1.id,
        modelConfigId: models.fixedModel.id,
        amount: new Decimal("4000.000000"),
        currency: "USDT",
        durationDays: 365,
        status: "COMPLETED",
        startDate: daysAgo(400),
        endDate: daysAgo(35),
        accruedYield: new Decimal("400.000000"),
      },
    }),
  );

  // Investment 12: FIXED completed - investor2 - finished 70 days ago
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_FIXED_COMPLETED_3,
        userId: users.investor2.id,
        modelConfigId: models.fixedModel.id,
        amount: new Decimal("6000.000000"),
        currency: "USDT",
        durationDays: 180,
        status: "COMPLETED",
        startDate: daysAgo(250),
        endDate: daysAgo(70),
        accruedYield: new Decimal("240.000000"),
      },
    }),
  );

  // Investment 13: VARIABLE completed - investor1 - finished 85 days ago
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_VARIABLE_COMPLETED,
        userId: users.investor1.id,
        modelConfigId: models.variableModel.id,
        amount: new Decimal("18000.000000"),
        currency: "USDT",
        durationDays: 365,
        status: "COMPLETED",
        startDate: daysAgo(450),
        endDate: daysAgo(85),
        accruedYield: new Decimal("1620.000000"),
      },
    }),
  );

  // Investment 14: FIXED cancelled - investor2 - cancelled 50 days ago
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_CANCELLED_2,
        userId: users.investor2.id,
        modelConfigId: models.fixedModel.id,
        amount: new Decimal("3500.000000"),
        currency: "USDT",
        durationDays: 180,
        status: "CANCELLED",
        startDate: daysAgo(100),
        endDate: daysAgo(50),
        accruedYield: new Decimal("0"),
      },
    }),
  );

  // Investment 15: FIXED active - investor3 - started 75 days ago
  investments.push(
    await prisma.investment.create({
      data: {
        id: IDS.INV_FIXED_INVESTOR3,
        userId: users.investor3.id,
        modelConfigId: models.fixedModel.id,
        amount: new Decimal("7500.000000"),
        currency: "USDT",
        durationDays: 180,
        status: "ACTIVE",
        startDate: daysAgo(75),
        endDate: daysFromNow(105),
        accruedYield: new Decimal("125.000000"),
      },
    }),
  );

  console.log("  ✓ Created 15 investments");
  return investments;
}

async function seedTransactions(
  users: Awaited<ReturnType<typeof seedUsers>>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _blockchains: Awaited<ReturnType<typeof seedBlockchains>>,
) {
  console.log("Seeding transactions...");

  const transactions = [
    // Deposit 1: investor1 - ETH - completed
    {
      userId: users.investor1.id,
      blockchainId: IDS.BLOCKCHAIN_ETH,
      type: "DEPOSIT" as const,
      amount: new Decimal("20000.000000"),
      currency: "USDT",
      status: "COMPLETED" as const,
      fireblocksTxId: "fb_tx_001",
      txHash: "0xabc123def456789012345678901234567890123456789012345678901234567890",
      sourceAddress: "0xExternalWallet1234567890123456789012345678",
      destinationAddress: users.investor1.depositAddress,
      networkFee: new Decimal("5.500000"),
      createdAt: daysAgo(100),
      processedAt: daysAgo(100),
      completedAt: daysAgo(100),
    },
    // Deposit 2: investor1 - BSC - completed
    {
      userId: users.investor1.id,
      blockchainId: IDS.BLOCKCHAIN_BSC,
      type: "DEPOSIT" as const,
      amount: new Decimal("30000.000000"),
      currency: "USDT",
      status: "COMPLETED" as const,
      fireblocksTxId: "fb_tx_002",
      txHash: "0xbcd234567890123456789012345678901234567890123456789012345678901234",
      sourceAddress: "0xExternalWallet2345678901234567890123456789",
      destinationAddress: users.investor1.depositAddress,
      networkFee: new Decimal("0.500000"),
      createdAt: daysAgo(95),
      processedAt: daysAgo(95),
      completedAt: daysAgo(95),
    },
    // Deposit 3: investor2 - TRON - completed
    {
      userId: users.investor2.id,
      blockchainId: IDS.BLOCKCHAIN_TRON,
      type: "DEPOSIT" as const,
      amount: new Decimal("15000.000000"),
      currency: "USDT",
      status: "COMPLETED" as const,
      fireblocksTxId: "fb_tx_003",
      txHash: "TRX123456789012345678901234567890123456789012345678901234567890",
      sourceAddress: "TExternalWallet12345678901234567890123456",
      destinationAddress: "TInvestor2Deposit12345678901234567890123",
      networkFee: new Decimal("1.000000"),
      createdAt: daysAgo(50),
      processedAt: daysAgo(50),
      completedAt: daysAgo(50),
    },
    // Deposit 4: investor3 - Polygon - completed
    {
      userId: users.investor3.id,
      blockchainId: IDS.BLOCKCHAIN_POLYGON,
      type: "DEPOSIT" as const,
      amount: new Decimal("1000.000000"),
      currency: "USDT",
      status: "COMPLETED" as const,
      fireblocksTxId: "fb_tx_004",
      txHash: "0xcde345678901234567890123456789012345678901234567890123456789012345",
      sourceAddress: "0xExternalWallet3456789012345678901234567890",
      destinationAddress: users.investor3.depositAddress,
      networkFee: new Decimal("0.100000"),
      createdAt: daysAgo(20),
      processedAt: daysAgo(20),
      completedAt: daysAgo(20),
    },
    // Withdrawal 1: investor1 - ETH - completed
    {
      userId: users.investor1.id,
      blockchainId: IDS.BLOCKCHAIN_ETH,
      type: "WITHDRAWAL" as const,
      amount: new Decimal("5000.000000"),
      currency: "USDT",
      status: "COMPLETED" as const,
      fireblocksTxId: "fb_tx_005",
      txHash: "0xdef456789012345678901234567890123456789012345678901234567890123456",
      sourceAddress: users.investor1.depositAddress,
      destinationAddress: "0xExternalWithdrawal123456789012345678901234",
      networkFee: new Decimal("8.000000"),
      createdAt: daysAgo(30),
      processedAt: daysAgo(30),
      completedAt: daysAgo(30),
    },
    // Withdrawal 2: investor1 - BSC - completed
    {
      userId: users.investor1.id,
      blockchainId: IDS.BLOCKCHAIN_BSC,
      type: "WITHDRAWAL" as const,
      amount: new Decimal("3000.000000"),
      currency: "USDT",
      status: "COMPLETED" as const,
      fireblocksTxId: "fb_tx_006",
      txHash: "0xefg567890123456789012345678901234567890123456789012345678901234567",
      sourceAddress: users.investor1.depositAddress,
      destinationAddress: "0xExternalWithdrawal234567890123456789012345",
      networkFee: new Decimal("0.300000"),
      createdAt: daysAgo(15),
      processedAt: daysAgo(15),
      completedAt: daysAgo(15),
    },
    // Deposit 5: investor1 - Arbitrum - pending
    {
      userId: users.investor1.id,
      blockchainId: IDS.BLOCKCHAIN_ARBITRUM,
      type: "DEPOSIT" as const,
      amount: new Decimal("10000.000000"),
      currency: "USDT",
      status: "PENDING" as const,
      fireblocksTxId: "fb_tx_007",
      txHash: null,
      sourceAddress: "0xExternalWallet4567890123456789012345678901",
      destinationAddress: users.investor1.depositAddress,
      networkFee: null,
      createdAt: daysAgo(1),
      processedAt: null,
      completedAt: null,
    },
    // Withdrawal 3: investor2 - TRON - processing
    {
      userId: users.investor2.id,
      blockchainId: IDS.BLOCKCHAIN_TRON,
      type: "WITHDRAWAL" as const,
      amount: new Decimal("2000.000000"),
      currency: "USDT",
      status: "PROCESSING" as const,
      fireblocksTxId: "fb_tx_008",
      txHash: null,
      sourceAddress: "TInvestor2Deposit12345678901234567890123",
      destinationAddress: "TExternalWithdrawal1234567890123456789012",
      networkFee: null,
      createdAt: daysAgo(2),
      processedAt: daysAgo(1),
      completedAt: null,
    },
    // Withdrawal 4: investor4 - ETH - failed (blocked user)
    {
      userId: users.investor4.id,
      blockchainId: IDS.BLOCKCHAIN_ETH,
      type: "WITHDRAWAL" as const,
      amount: new Decimal("1000.000000"),
      currency: "USDT",
      status: "FAILED" as const,
      fireblocksTxId: "fb_tx_009",
      txHash: null,
      sourceAddress: users.investor4.depositAddress,
      destinationAddress: "0xExternalWithdrawal345678901234567890123456",
      networkFee: null,
      failureReason: "User account is blocked",
      createdAt: daysAgo(5),
      processedAt: daysAgo(5),
      completedAt: null,
    },
    // Deposit 6: investor1 - Solana - completed
    {
      userId: users.investor1.id,
      blockchainId: IDS.BLOCKCHAIN_SOLANA,
      type: "DEPOSIT" as const,
      amount: new Decimal("5000.000000"),
      currency: "USDT",
      status: "COMPLETED" as const,
      fireblocksTxId: "fb_tx_010",
      txHash: "SOL123456789012345678901234567890123456789012345678901234567890",
      sourceAddress: "SolExternalWallet123456789012345678901234567890",
      destinationAddress: "SolInvestor1Deposit123456789012345678901234",
      networkFee: new Decimal("0.010000"),
      createdAt: daysAgo(10),
      processedAt: daysAgo(10),
      completedAt: daysAgo(10),
    },
  ];

  for (const tx of transactions) {
    await prisma.transaction.create({ data: tx });
  }

  console.log(`  ✓ Created ${transactions.length} transactions`);
}

async function seedMonthlyYields(admin: { id: string }) {
  console.log("Seeding monthly yields...");

  const monthlyYields = [
    {
      id: IDS.MONTHLY_YIELD_1,
      month: getMonth(-60), // 2 months ago
      actualReturnPct: new Decimal("4.20"),
      documentUrl: "https://storage.tokelab.com/reports/2024-10-yield-report.pdf",
      uploadedBy: admin.id,
      status: "PROCESSED" as const,
      createdAt: daysAgo(30),
      processedAt: daysAgo(28),
    },
    {
      id: IDS.MONTHLY_YIELD_2,
      month: getMonth(-30), // 1 month ago
      actualReturnPct: new Decimal("3.80"),
      documentUrl: "https://storage.tokelab.com/reports/2024-11-yield-report.pdf",
      uploadedBy: admin.id,
      status: "PROCESSED" as const,
      createdAt: daysAgo(5),
      processedAt: daysAgo(3),
    },
    {
      id: IDS.MONTHLY_YIELD_3,
      month: getMonth(0), // Current month
      actualReturnPct: new Decimal("5.10"),
      documentUrl: null,
      uploadedBy: admin.id,
      status: "PENDING" as const,
      createdAt: daysAgo(1),
      processedAt: null,
    },
  ];

  for (const my of monthlyYields) {
    await prisma.monthlyYield.create({ data: my });
  }

  console.log(`  ✓ Created ${monthlyYields.length} monthly yields`);
  return monthlyYields;
}

async function seedInvestmentYields(
  investments: Awaited<ReturnType<typeof seedInvestments>>,
  monthlyYields: Awaited<ReturnType<typeof seedMonthlyYields>>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _models: Awaited<ReturnType<typeof seedInvestmentModelConfigs>>,
) {
  console.log("Seeding investment yields...");

  const yields = [];

  // VARIABLE investment yields (linked to monthly yields)
  const variableInvestment = investments.find((i) => i.id === IDS.INV_VARIABLE_ACTIVE);
  if (variableInvestment) {
    // Month 1 yield (processed)
    yields.push({
      investmentId: variableInvestment.id,
      monthlyYieldId: IDS.MONTHLY_YIELD_1,
      month: monthlyYields[0].month,
      grossReturn: new Decimal("4.20"),
      activeDays: 30,
      amount: new Decimal("504.000000"), // 20000 * 4.20% * 60% = 504
      status: "PAID" as const,
      paidAt: daysAgo(25),
    });

    // Month 2 yield (processed)
    yields.push({
      investmentId: variableInvestment.id,
      monthlyYieldId: IDS.MONTHLY_YIELD_2,
      month: monthlyYields[1].month,
      grossReturn: new Decimal("3.80"),
      activeDays: 30,
      amount: new Decimal("456.000000"), // 20000 * 3.80% * 60% = 456
      status: "PAID" as const,
      paidAt: daysAgo(2),
    });

    // Month 3 yield (pending)
    yields.push({
      investmentId: variableInvestment.id,
      monthlyYieldId: IDS.MONTHLY_YIELD_3,
      month: monthlyYields[2].month,
      grossReturn: new Decimal("5.10"),
      activeDays: 15, // Partial month
      amount: new Decimal("306.000000"), // 20000 * 5.10% * 60% * 0.5 = 306
      status: "PENDING" as const,
      paidAt: null,
    });
  }

  // FIXED investment yields (calculated from APR)
  const fixedInvestment1 = investments.find((i) => i.id === IDS.INV_FIXED_ACTIVE_1);
  if (fixedInvestment1) {
    // Month 1 (8% APR)
    yields.push({
      investmentId: fixedInvestment1.id,
      monthlyYieldId: null,
      month: getMonth(-60),
      grossReturn: new Decimal("8.00"),
      activeDays: 30,
      amount: new Decimal("65.753425"), // 10000 * 8% / 365 * 30
      status: "PAID" as const,
      paidAt: daysAgo(60),
    });

    // Month 2 (9% APR - after first step)
    yields.push({
      investmentId: fixedInvestment1.id,
      monthlyYieldId: null,
      month: getMonth(-30),
      grossReturn: new Decimal("9.00"),
      activeDays: 30,
      amount: new Decimal("73.972603"), // 10000 * 9% / 365 * 30
      status: "PAID" as const,
      paidAt: daysAgo(30),
    });

    // Month 3 (10% APR - after second step)
    yields.push({
      investmentId: fixedInvestment1.id,
      monthlyYieldId: null,
      month: getMonth(0),
      grossReturn: new Decimal("10.00"),
      activeDays: 15,
      amount: new Decimal("41.095890"), // 10000 * 10% / 365 * 15
      status: "PENDING" as const,
      paidAt: null,
    });
  }

  // FIXED investment 2 yields
  const fixedInvestment2 = investments.find((i) => i.id === IDS.INV_FIXED_ACTIVE_2);
  if (fixedInvestment2) {
    yields.push({
      investmentId: fixedInvestment2.id,
      monthlyYieldId: null,
      month: getMonth(0),
      grossReturn: new Decimal("8.00"),
      activeDays: 30,
      amount: new Decimal("32.876712"), // 5000 * 8% / 365 * 30
      status: "PENDING" as const,
      paidAt: null,
    });
  }

  // Completed investment - all yields paid
  const completedInvestment = investments.find((i) => i.id === IDS.INV_FIXED_COMPLETED);
  if (completedInvestment) {
    yields.push({
      investmentId: completedInvestment.id,
      monthlyYieldId: null,
      month: getMonth(-180),
      grossReturn: new Decimal("8.00"),
      activeDays: 30,
      amount: new Decimal("19.726027"),
      status: "PAID" as const,
      paidAt: daysAgo(150),
    });
  }

  for (const y of yields) {
    await prisma.investmentYield.create({ data: y });
  }

  console.log(`  ✓ Created ${yields.length} investment yields`);
}

async function seedNotifications(users: Awaited<ReturnType<typeof seedUsers>>) {
  console.log("Seeding notifications...");

  const notifications = [
    {
      userId: users.investor1.id,
      type: "deposit_confirmed",
      title: "Deposit Confirmed",
      message: "Your deposit of 20,000 USDT has been confirmed.",
      data: { amount: 20000, currency: "USDT", blockchain: "Ethereum" },
      isRead: true,
      createdAt: daysAgo(100),
    },
    {
      userId: users.investor1.id,
      type: "investment_created",
      title: "Investment Created",
      message: "Your investment of 10,000 USDT in Fixed APR has been created.",
      data: { amount: 10000, model: "FIXED", duration: 365 },
      isRead: true,
      createdAt: daysAgo(90),
    },
    {
      userId: users.investor1.id,
      type: "yield_available",
      title: "Yield Available",
      message: "You have 504 USDT in yield ready to claim.",
      data: { amount: 504, month: "2024-10" },
      isRead: true,
      createdAt: daysAgo(30),
    },
    {
      userId: users.investor1.id,
      type: "withdrawal_completed",
      title: "Withdrawal Completed",
      message: "Your withdrawal of 5,000 USDT has been completed.",
      data: { amount: 5000, currency: "USDT", txHash: "0xdef456..." },
      isRead: false,
      createdAt: daysAgo(30),
    },
    {
      userId: users.investor2.id,
      type: "kyc_in_progress",
      title: "KYC Verification Started",
      message: "Your identity verification is being processed.",
      data: { status: "IN_PROGRESS" },
      isRead: true,
      createdAt: daysAgo(50),
    },
    {
      userId: users.investor1.id,
      type: "system_announcement",
      title: "New Feature: Variable Model",
      message: "We have launched a new Variable investment model with 60% profit sharing!",
      data: { feature: "variable_model" },
      isRead: false,
      createdAt: daysAgo(60),
    },
    {
      userId: users.investor4.id,
      type: "account_blocked",
      title: "Account Blocked",
      message: "Your account has been blocked. Please contact support.",
      data: { reason: "suspicious_activity" },
      isRead: false,
      createdAt: daysAgo(10),
    },
    {
      userId: users.investor1.id,
      type: "yield_paid",
      title: "Yield Paid",
      message: "Your yield of 456 USDT has been credited to your balance.",
      data: { amount: 456, month: "2024-11" },
      isRead: false,
      createdAt: daysAgo(2),
    },
  ];

  for (const notification of notifications) {
    await prisma.notification.create({ data: notification });
  }

  console.log(`  ✓ Created ${notifications.length} notifications`);
}

async function seedUserPreferences(users: Awaited<ReturnType<typeof seedUsers>>) {
  console.log("Seeding user preferences...");

  const preferences = [
    {
      userId: users.investor1.id,
      emailNotifications: {
        deposits: true,
        withdrawals: true,
        yields: true,
        marketing: false,
      },
      pushNotifications: {
        deposits: true,
        withdrawals: true,
        yields: true,
        marketing: false,
      },
      language: "es",
    },
    {
      userId: users.investor2.id,
      emailNotifications: {
        deposits: true,
        withdrawals: true,
        yields: true,
        marketing: true,
      },
      pushNotifications: {
        deposits: false,
        withdrawals: true,
        yields: false,
        marketing: false,
      },
      language: "es",
    },
    {
      userId: users.investor3.id,
      emailNotifications: {
        deposits: true,
        withdrawals: true,
        yields: true,
        marketing: false,
      },
      pushNotifications: {
        deposits: true,
        withdrawals: true,
        yields: true,
        marketing: true,
      },
      language: "en",
    },
    {
      userId: users.investor4.id,
      emailNotifications: {
        deposits: false,
        withdrawals: false,
        yields: false,
        marketing: false,
      },
      pushNotifications: {
        deposits: false,
        withdrawals: false,
        yields: false,
        marketing: false,
      },
      language: "es",
    },
  ];

  for (const pref of preferences) {
    await prisma.userPreference.create({ data: pref });
  }

  console.log(`  ✓ Created ${preferences.length} user preferences`);
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Clean existing data (in reverse order of dependencies)
  console.log("Cleaning existing data...");
  await prisma.investmentYield.deleteMany();
  await prisma.monthlyYield.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.investmentModelConfig.deleteMany();
  await prisma.user.deleteMany();
  await prisma.blockchain.deleteMany();
  console.log("  ✓ Cleaned all tables\n");

  // Seed in order of dependencies
  const blockchains = await seedBlockchains();
  const users = await seedUsers();
  const modelConfigs = await seedInvestmentModelConfigs();
  const investments = await seedInvestments(users, modelConfigs);
  await seedTransactions(users, blockchains);
  const monthlyYields = await seedMonthlyYields(users.admin);
  await seedInvestmentYields(investments, monthlyYields, modelConfigs);
  await seedNotifications(users);
  await seedUserPreferences(users);

  console.log("\n✅ Seed completed successfully!");
  console.log("\nSummary:");
  console.log("  - 6 blockchains");
  console.log("  - 5 users (1 admin + 4 investors)");
  console.log("  - 2 investment model configs");
  console.log("  - 6 investments");
  console.log("  - 10 transactions");
  console.log("  - 3 monthly yields");
  console.log("  - 9 investment yields");
  console.log("  - 8 notifications");
  console.log("  - 4 user preferences");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
