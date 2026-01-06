import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { PrismaClient } from '../src/generated/prisma/client'

// Load environment variables
const env = dotenv.config()
dotenvExpand.expand(env)

const prisma = new PrismaClient()

async function checkDataExists(): Promise<boolean> {
  const userCount = await prisma.user.count()
  return userCount > 0
}

async function main() {
  console.log('🔧 Running database setup...\n')

  // Check if data already exists
  const hasData = await checkDataExists()

  if (hasData) {
    console.log('ℹ️  Database already has data. Skipping seed.')
    console.log('   Use "npm run db:seed" to force re-seed (will delete existing data).')
  } else {
    console.log('📦 Database is empty. Running seed...\n')
    // Import and run seed
    const { execSync } = await import('child_process')
    execSync('npx prisma db seed', { stdio: 'inherit', cwd: process.cwd() })
  }
}

main()
  .catch((e) => {
    console.error('❌ Setup failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
