import { prisma } from '@/lib/db'

// This route should not be statically generated
export const dynamic = 'force-dynamic'

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { winnerId } = body
    
    // Ensure config exists
    let cfg = await prisma.config.findUnique({ where: { id: 1 } })
    if (!cfg) cfg = await prisma.config.create({ data: { id: 1 } })

    const total = await prisma.entry.count()
    const remaining = await prisma.entry.count({ where: { hasWon: false } })
    const drawn = total - remaining
    
    if (remaining <= 0) {
      return new Response('No remaining entries', { status: 400 })
    }

    const spinMs = randInt(cfg.spinMinSec * 1000, cfg.spinMaxSec * 1000)

    const winner = await prisma.$transaction(async (tx) => {
      let pickedId = winnerId
      
      // If no specific winner ID provided, pick randomly
      if (!pickedId) {
        const picked = await tx.$queryRaw<{ id: string }[]>`
          SELECT "id" FROM "Entry"
          WHERE "hasWon" = false
          ORDER BY random()
          LIMIT 1
        `
        pickedId = picked[0]?.id
      }
      
      if (!pickedId) throw new Error('No eligible entry found')

      // Verify the entry exists and hasn't won yet
      const entry = await tx.entry.findUnique({ where: { id: pickedId } })
      if (!entry) throw new Error('Entry not found')
      if (entry.hasWon) throw new Error('Entry has already won')

      const round = (await tx.winner.count()) + 1
      const updated = await tx.entry.update({ where: { id: pickedId }, data: { hasWon: true } })
      await tx.winner.create({ data: { entryId: pickedId, round } })
      return { ...updated, round }
    })

    const counters = { total, remaining: remaining - 1, drawn: drawn + 1 }
    return Response.json({ winner, maskPhone: cfg.maskPhone, spinMs, counters })
  } catch (error) {
    console.error('Draw API error:', error)
    return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 400 })
  }
}
