# Web3 Custody Platform API

Production-ready REST API for Web3 custody using Fireblocks with segregated architecture.

## Architecture

### Segregated Vault Model
- **One Fireblocks Vault Account per user** - Complete fund isolation
- No omnibus model - each user has their own vault and deposit addresses
- Balances and funds are isolated at the Fireblocks level

### Layered Architecture

```
/src
  /app.ts                -> Hono app bootstrap
  /routes                -> REST routes
  /controllers           -> HTTP controllers
  /usecases              -> Business logic
  /domain                -> Domain entities
  /infra
    /fireblocks           -> Fireblocks SDK wrapper
    /db                   -> Prisma repositories
    /auth                 -> Auth middleware (Auth0)
    /webhooks             -> Fireblocks webhook handlers
  /libs                   -> Logger, errors, idempotency helpers
  /config                 -> Environment config
/prisma
  schema.prisma
```

## Tech Stack

- **Framework**: Hono (lightweight, fast)
- **ORM**: Prisma
- **Database**: NeonDB (serverless PostgreSQL)
- **Custody**: Fireblocks SDK
- **Language**: TypeScript

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
# Server
NODE_ENV=development
PORT=3001

# Database (NeonDB)
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
DIRECT_URL=postgresql://user:password@host/db?sslmode=require

# Fireblocks
FIREBLOCKS_API_KEY=your_api_key
FIREBLOCKS_SECRET_KEY_PATH=./fireblocks_private_key.pem
FIREBLOCKS_BASE_URL=https://api.fireblocks.io
FIREBLOCKS_WEBHOOK_SECRET=your_webhook_secret

# Auth (Auth0)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://your-api-identifier  # Optional: API identifier/audience

# CORS
CORS_ORIGINS=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### 3. Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate
```

### 4. Fireblocks Setup

1. Get your Fireblocks API key and private key
2. Place private key file in project root (or specify path in env)
3. Configure webhook endpoint in Fireblocks dashboard:
   - URL: `https://your-api.com/api/webhooks/fireblocks`
   - Secret: Use `FIREBLOCKS_WEBHOOK_SECRET`

## API Endpoints

### User Endpoints (Require Authentication)

#### Create Vault
```http
POST /api/vault
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Vault",
  "customerRefId": "optional-idempotency-key"
}
```

### Webhooks

#### Fireblocks Webhook
```http
POST /api/webhooks/fireblocks
X-Fireblocks-Signature: <signature>
Content-Type: application/json

{
  "type": "TRANSACTION_STATUS_CHANGED",
  "data": { ... }
}
```

## Database Schema

### Key Models

- **User**: End users of the platform
- **Vault**: 1:1 relationship with Fireblocks vault (segregation)
  - Each user has exactly one vault
  - Complete fund isolation at Fireblocks level

## NeonDB + Prisma Serverless Best Practices

1. **Connection Pooling**: Uses Neon's connection pooler via `@neondatabase/serverless`
2. **Direct URL**: Separate `DIRECT_URL` for migrations (bypasses pooler)
3. **Prisma Client**: Instantiated as singleton, serverless-safe
4. **No Long-Lived Connections**: Each request gets a fresh connection from pool

## Fireblocks Integration

### Segregated Architecture
- Each user gets their own Fireblocks Vault Account
- Vault creation is idempotent (checked before creation)
- All operations are scoped to user's vault

### Webhook Handling
- Signature verification for security
- Idempotent processing
- Handles:
  - Deposit confirmations
  - Transaction status changes
  - Transaction failures

## Development

```bash
# Run dev server
npm run dev

# Build
npm run build

# Start production
npm start

# Database
npm run db:generate  # Generate Prisma Client
npm run db:migrate    # Run migrations
npm run db:studio     # Open Prisma Studio
```

## Production Considerations

1. **Authentication**: Implement proper JWT verification (currently placeholder)
2. **Idempotency**: Use dedicated idempotency table with TTL
3. **Error Handling**: Add structured logging and monitoring
4. **Rate Limiting**: Add rate limiting middleware
5. **Transaction Compensation**: Handle Fireblocks failures gracefully
6. **Background Jobs**: Transaction reconciliation, cleanup jobs (separate package)

## Notes

- **No Cron Jobs**: Background jobs live in separate package
- **No Omnibus Logic**: All operations are per-user, per-vault
- **Fireblocks as Infrastructure**: Never accessed directly from controllers
- **Dependency Injection**: Constructor-based DI (consider DI container for production)
