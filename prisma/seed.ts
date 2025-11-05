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
    ['SARVASH','SARVASH','4694125917'],
    ['SUNIL','KALA','9293732244'],
    ['VIKAS','VIKAS','5162099065'],
    ['SHEEBA','SONI','6316454670'],
    ['SUNDAS','SALMAN','3479223964'],
    ['RUKSANA','BEGUM','9172077158'],
    ['SURESH','KANDULU','3473483258'],
    ['MANOJ','KUMAR','3476266721'],
    ['SARABJIT','SINGH','9172855118'],
    ['ROSHMI','POHAMI','6314156123'],
    ['MEHWISH','SHOUKAT','9295385752'],
    ['GAURAV','SINGH','6468537813'],
    ['ANIL','BHATIA','5164391023'],
    ['GULSHAR','SHAMSHER','3477212823'],
    ['MANJITH','SINGH','6464834944'],
    ['HARRY','SINGH','3475574711'],
    ['SAMUEL','SAMUEL','7183473597'],
    ['NIRMA','NIRMA','6464284299'],
    ['FARHAT','MIR','9174426190'],
    ['JAGTAR','SINGH','3473258699'],
    ['kamal','kaur','3476153157'],
    ['KARNAL','SINGH','3476054658'],
    ['MANJIT','MANOHAR','3475783331'],
    ['JASBIR','KAUR','9294274362'],
    ['MONESH','MONESH','3478866578'],
    ['JAGDEEP','SINGH','6466123000'],
    ['TAHSEEM','ALI SYED','9292352033'],
    ['MUHAMMAD','ZAIN','9294002949'],
    ['AHANA','AHANA','5167179626'],
    ['ASHFAQ','ASHFAQ','3478066473'],
    ['BALVINDER','SINGH','3477860447'],
    ['AHMED','ESAA','7184151995'],
    ['SABHA','MALIK','9293699598'],
    ['UMAR','UMAR','6469349321'],
    ['RAVINDER','SINGH','9173794243'],
    ['RENU','BALA','3474768293'],
    ['SOPHIA','RAMBARRAN','7185062069'],
    ['JASWINDER','SINGH','7185141203'],
    ['PALWINDER','SINGH','6462559020'],
    ['AOWASI','AOWASI','3473366430'],
    ['BIJU','BIJU','3475932882'],
    ['INDERJEET','KAUR','7156713276'],
    ['KRITI','BALA','9296846669'],
    ['SHARAN','KAUR','5162636994'],
    ['PARVEEN','SANGAR','5168138714']
  ]

  for (const [f, l, p] of entries) {
    await prisma.entry.upsert({
      where: { phone: p },
      update: {},
      create: { firstName: f, lastName: l, phone: p, hasWon: false }
    })
  }
  
  const count = await prisma.entry.count()
  console.log(`✅ Seed complete! Total entries: ${count}`)
}

main().finally(() => prisma.$disconnect())
