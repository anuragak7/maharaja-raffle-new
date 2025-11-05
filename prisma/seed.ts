import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Bellerose database seed...')
  
  // Configure default settings
  await prisma.config.upsert({
    where: { id: 1 },
    update: {},
    create: {
      maskPhone: true,
      spinMinSec: 15,
      spinMaxSec: 20
    }
  })

  console.log('✅ Seed complete! Config initialized.')
  console.log('ℹ️  Fresh entries already exist in database.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
