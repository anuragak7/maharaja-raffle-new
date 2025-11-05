import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Render database seed...')
  
  await prisma.config.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, maskPhone: true, spinMinSec: 15, spinMaxSec: 20 }
  })
  
  const entries = [
    ['John','George','5165079185'],
    ['SARBJIT','KAUR','9174420511'],
    ['SARVASH','SARVASH','4694125917']
  ]

  for (const [f, l, p] of entries) {
    await prisma.entry.upsert({
      where: { phone: p },
      update: {},
      create: { firstName: f, lastName: l, phone: p }
    })
  }
  
  console.log('✅ Seed complete!')
}

main().finally(() => prisma.$disconnect())
