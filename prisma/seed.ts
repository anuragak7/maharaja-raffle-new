import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.config.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, maskPhone: true, spinMinSec: 15, spinMaxSec: 20 }
  })

  const sample = [
    ['Aarav','Patel','4045550101'],
    ['Isha','Reddy','4045550102'],
    ['Vikram','Singh','4045550103'],
    ['Priya','Shah','4045550104'],
    ['Rohan','Iyer','4045550105']
  ]

  for (const [f,l,p] of sample) {
    await prisma.entry.upsert({
      where: { phone: p },
      update: { firstName: f, lastName: l },
      create: { firstName: f, lastName: l, phone: p }
    })
  }
}

main().finally(async () => { await prisma.$disconnect() })
